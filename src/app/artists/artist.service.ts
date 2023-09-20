import { Injectable } from "@angular/core";
import {
  Artist,
  ArtistsSources,
  RawMusicBrainzArtistData,
  ScrapedArtist,
  ScrapedArtistData,
  Suggestion,
} from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, Subject, map, of, switchMap, take } from "rxjs";
import { CountryService } from "../country/country.service";
import { environment } from "src/environments/environment";
import { MusicBrainzService } from "../music-brainz/music-brainz.service";
import { RegionService } from "../region/region.service";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private source!: ArtistsSources;
  private userTopArtists$ = new BehaviorSubject<Artist[]>([]);
  private scrapedArtists$ = new BehaviorSubject<ScrapedArtistData | undefined>(undefined);
  private artistsWithoutCountryQuantity$ = new BehaviorSubject<number | undefined>(undefined);

  private START_INDICATOR_OFFSET = 13;
  private END_INDICATOR_OFFSET = 11;

  private hasRequestedTopArtists = false;

  constructor(
    private supabaseService: SupabaseService,
    private countryService: CountryService,
    private musicBrainzService: MusicBrainzService,
    private regionService: RegionService
  ) {
    this.userTopArtists$.subscribe((artists) => {
      this.countryService.updateCountriesCount(artists);
      this.regionService.updateRegionsCount(artists);
    });
  }

  toggleArtistsRequestStatus(): void {
    this.hasRequestedTopArtists = true;
  }

  setUserTopArtists(userTopArtists: Artist[]): void {
    this.assignCountriesToKnownArtists(userTopArtists).subscribe(() => {
      this.handleArtistsWithoutCountry(userTopArtists);
    });
  }

  assignCountriesToKnownArtists(userTopArtists: Artist[]): Observable<boolean> {
    return this.getArtistsFromDatabase(userTopArtists).pipe(
      switchMap((artistsFromDatabase) => {
        artistsFromDatabase.forEach((artistFromDatabase) => {
          const matchedArtist = userTopArtists.find(
            (topArtist) => topArtist.name == artistFromDatabase.name
          );

          if (matchedArtist) matchedArtist.country = artistFromDatabase.country;
        });

        this.userTopArtists$.next(userTopArtists);
        return of(true);
      })
    );
  }

  handleArtistsWithoutCountry(userTopArtists: Artist[]): void {
    const artistsWithoutCountry = userTopArtists.filter((artist) => artist.country == undefined);
    this.artistsWithoutCountryQuantity$.next(artistsWithoutCountry.length);
    if (!artistsWithoutCountry) return;

    const scrapedArtists: ScrapedArtist[] = [];

    this.findArtistsCountryOfOrigin(artistsWithoutCountry)
      .pipe(take(artistsWithoutCountry.length))
      .subscribe({
        next: (scrapedArtist) => {
          scrapedArtists.push(scrapedArtist);

          this.scrapedArtists$.next({
            artist: scrapedArtist,
            total: artistsWithoutCountry.length,
            remanining: scrapedArtists.length,
          });

          const matchedArtist = userTopArtists.find((artist) => artist.name == scrapedArtist.name);
          if (matchedArtist) matchedArtist.country = scrapedArtist.country;

          this.userTopArtists$.next(userTopArtists);
        },
        complete: () => {
          this.supabaseService.saveSuggestions(scrapedArtists);
        },
      });
  }

  getArtistsFromDatabase(userTopArtists: Artist[]): Observable<Artist[]> {
    const artistsNames = userTopArtists.map((artist) => artist.name);

    return this.supabaseService
      .getBestSuggestionByArtists(artistsNames)
      .pipe(map((bestSuggestions) => this.transformSuggestionsInArtists(bestSuggestions)));
  }

  getUserTopArtists(): Observable<Artist[]> {
    return this.userTopArtists$.asObservable();
  }

  getScrapedArtists(): Observable<ScrapedArtistData | undefined> {
    return this.scrapedArtists$.asObservable();
  }

  getArtistsWithoutCountryQuantity(): Observable<number | undefined> {
    return this.artistsWithoutCountryQuantity$.asObservable();
  }

  getArtistsRequestStatus(): boolean {
    return this.hasRequestedTopArtists;
  }

  setSource(source: ArtistsSources): void {
    this.source = source;
  }

  getSource(): ArtistsSources {
    return this.source;
  }

  transformNamesInArtists(artistsNames: string[]): Artist[] {
    return artistsNames.map((artistName): Artist => this.createArtist(artistName));
  }

  findArtistsCountryOfOrigin(artists: Artist[]): Observable<ScrapedArtist> {
    const artists$ = new Subject<ScrapedArtist>();

    const artistsNames = artists.map((artist) => artist.name);
    fetch(environment.PAGE_FINDER_URL, {
      method: "POST",
      body: artistsNames.join("###"),
    })
      .then(async (response) => {
        const streamReader = response.body?.getReader();
        if (!streamReader) return;

        const textDecoder = new TextDecoder();
        let streamAccumulatedContent = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await streamReader.read();
          if (done) break;

          streamAccumulatedContent += textDecoder.decode(value);
          if (!this.hasReceivedFullArtistData(streamAccumulatedContent)) continue;

          const startIndex =
            streamAccumulatedContent.indexOf("START_OF_JSON") + this.START_INDICATOR_OFFSET;
          const endIndex = streamAccumulatedContent.indexOf("END_OF_JSON");

          const rawArtistData: RawMusicBrainzArtistData = JSON.parse(
            streamAccumulatedContent.slice(startIndex, endIndex)
          );

          streamAccumulatedContent = streamAccumulatedContent.slice(
            endIndex + this.END_INDICATOR_OFFSET
          );

          const artistData = {
            name: rawArtistData.name,
            artistDataFromMusicBrainz: this.musicBrainzService.getArtistData(rawArtistData),
          };

          const { country, secondaryLocation } =
            this.musicBrainzService.getArtistLocation(artistData);

          if (country == undefined && secondaryLocation != undefined) {
            this.countryService
              .findCountryBySecondaryLocation(secondaryLocation)
              .subscribe((countryFromSecondaryLocation) => {
                artists$.next({
                  name: artistData.name,
                  country: countryFromSecondaryLocation,
                  secondaryLocation,
                });
              });
          } else {
            artists$.next({
              name: artistData.name,
              country,
              secondaryLocation,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return artists$.asObservable();
  }

  private hasReceivedFullArtistData(streamAccumulatedContent: string): boolean {
    return (
      streamAccumulatedContent.includes("START_OF_JSON") &&
      streamAccumulatedContent.includes("END_OF_JSON")
    );
  }

  private createArtist(artistName: string): Artist {
    return {
      name: artistName,
      country: undefined,
    };
  }

  private transformSuggestionsInArtists(suggestions: Suggestion[]): Artist[] {
    return suggestions.map((suggestion) => {
      return {
        name: suggestion.artist_name,
        country: this.countryService.getCountryByCode(suggestion.country_code),
      } as Artist;
    });
  }
}
