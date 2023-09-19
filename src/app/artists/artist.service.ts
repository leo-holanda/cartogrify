import { Injectable } from "@angular/core";
import {
  Artist,
  ArtistsSources,
  ScrapedArtist,
  ScrapedArtistData,
  Suggestion,
} from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, take } from "rxjs";
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

  setUserTopArtists(topArtistsNames: string[]): void {
    this.hasRequestedTopArtists = true;

    this.supabaseService
      .getBestSuggestionByArtists(topArtistsNames)
      .subscribe((bestSuggestions) => {
        const artistsFromDatabase = this.transformSuggestionsInArtists(bestSuggestions);
        const artistsWithOriginalOrder = this.applyOriginalOrder(
          topArtistsNames,
          artistsFromDatabase
        );

        this.userTopArtists$.next(artistsWithOriginalOrder);

        const artistsWithoutCountry = this.findArtistsWithoutCountry(
          topArtistsNames,
          artistsFromDatabase
        );

        if (artistsWithoutCountry.length == 0) {
          this.artistsWithoutCountryQuantity$.next(0);
          this.countryService
            .getCountriesCount()
            .pipe(take(1))
            .subscribe((countriesCount) => {
              this.supabaseService.saveDiversityIndex(countriesCount.length);
            });
        } else {
          this.artistsWithoutCountryQuantity$.next(artistsWithoutCountry.length);
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

                const artistsWithOriginalOrder = this.applyOriginalOrder(topArtistsNames, [
                  ...artistsFromDatabase,
                  ...scrapedArtists,
                ]);

                this.userTopArtists$.next(artistsWithOriginalOrder);
              },
              complete: () => {
                this.supabaseService.saveSuggestions(scrapedArtists);
                this.countryService
                  .getCountriesCount()
                  .pipe(take(1))
                  .subscribe((countriesCount) => {
                    this.supabaseService.saveDiversityIndex(countriesCount.length);
                  });
              },
            });
        }
      });
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
