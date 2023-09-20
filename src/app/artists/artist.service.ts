import { Injectable } from "@angular/core";
import {
  Artist,
  ArtistsSources,
  ScrapedArtist,
  ScrapedArtistData,
  Suggestion,
} from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, Subject, map, of, switchMap, take } from "rxjs";
import { CountryService } from "../country/country.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private source!: ArtistsSources;
  private userTopArtists$ = new BehaviorSubject<Artist[]>([]);
  private scrapedArtists$ = new BehaviorSubject<ScrapedArtistData | undefined>(undefined);
  private artistsWithoutCountryQuantity$ = new BehaviorSubject<number | undefined>(undefined);

  private hasRequestedTopArtists = false;

  constructor(private supabaseService: SupabaseService, private countryService: CountryService) {}

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
        const reader = response.body?.getReader();

        if (reader) {
          const textDecoder = new TextDecoder();
          let eventStreamAccumulator = "";
          const START_INDICATOR_OFFSET = 13;
          const END_INDICATOR_OFFSET = 11;

          while (true) {
            const { value, done } = await reader.read();
            eventStreamAccumulator += textDecoder.decode(value);

            if (
              eventStreamAccumulator.includes("START_OF_JSON") &&
              eventStreamAccumulator.includes("END_OF_JSON")
            ) {
              const startIndex =
                eventStreamAccumulator.indexOf("START_OF_JSON") + START_INDICATOR_OFFSET;
              const endIndex = eventStreamAccumulator.indexOf("END_OF_JSON");
              const { name, data } = JSON.parse(eventStreamAccumulator.slice(startIndex, endIndex));

              const { country, secondaryLocation } =
                this.countryService.getArtistLocationFromMusicBrainzResponse(name, data);

              if (country == undefined && secondaryLocation != undefined) {
                setTimeout(() => {
                  this.countryService
                    .findCountryBySecondaryLocation(secondaryLocation)
                    .subscribe((countryFromSecondaryLocation) => {
                      artists$.next({
                        name,
                        country: countryFromSecondaryLocation,
                        secondaryLocation,
                      });
                    });
                }, 1000);
              } else {
                artists$.next({
                  name,
                  country,
                  secondaryLocation,
                });
              }

              eventStreamAccumulator = eventStreamAccumulator.slice(
                endIndex + END_INDICATOR_OFFSET
              );
            }

            if (done) break;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return artists$.asObservable();
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
