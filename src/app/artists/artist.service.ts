import { Injectable } from "@angular/core";
import {
  Artist,
  ArtistsSources,
  ScrapedArtist,
  ScrapedArtistData,
  Suggestion,
} from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, map, of, switchMap, take } from "rxjs";
import { CountryService } from "../country/country.service";

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
    this.assignCountriesToKnownArtists(userTopArtists).subscribe((done) => {
      this.userTopArtists$.next(userTopArtists);

      const artistsWithoutCountry = userTopArtists.filter((artist) => artist.country == undefined);
      this.artistsWithoutCountryQuantity$.next(artistsWithoutCountry.length);

      if (artistsWithoutCountry.length > 0) {
        const scrapedArtists: ScrapedArtist[] = [];

        this.countryService
          .findArtistsCountryOfOrigin(artistsWithoutCountry)
          .pipe(take(artistsWithoutCountry.length))
          .subscribe({
            next: (scrapedArtist) => {
              scrapedArtists.push(scrapedArtist);

              this.scrapedArtists$.next({
                artist: scrapedArtist,
                total: artistsWithoutCountry.length,
                remanining: scrapedArtists.length,
              });

              const matchedArtist = userTopArtists.find(
                (artist) => artist.name == scrapedArtist.name
              );

              if (matchedArtist) matchedArtist.country = scrapedArtist.country;

              this.userTopArtists$.next(userTopArtists);
            },
            complete: () => {
              this.supabaseService.saveSuggestions(scrapedArtists);
            },
          });
      }
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

        return of(true);
      })
    );
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

  private findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: Artist[]
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase.some(
          (artistsFromDatabase) => topArtistName === artistsFromDatabase.name
        )
    );
  }

  private applyOriginalOrder(topArtistsNames: string[], artistsFromDatabase: Artist[]): Artist[] {
    return topArtistsNames
      .map((artistName) => artistsFromDatabase.find((artist) => artist.name == artistName))
      .filter((artist) => artist) as Artist[];
  }
}
