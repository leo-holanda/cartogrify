import { Injectable } from "@angular/core";
import { Artist, ScrapedArtist, ScrapedArtistData, Suggestion } from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable } from "rxjs";
import { CountryService } from "../country/country.service";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private userTopArtists$ = new BehaviorSubject<Artist[]>([]);
  private scrapedArtists$ = new BehaviorSubject<ScrapedArtistData | undefined>(undefined);
  private hasArtistsWithoutCountry$ = new BehaviorSubject<boolean | undefined>(undefined);

  private hasRequestedTopArtists = false;

  constructor(private supabaseService: SupabaseService, private countryService: CountryService) {}

  setUserTopArtists(topArtistsNames: string[]): void {
    this.hasRequestedTopArtists = true;
    this.observeArtistsChanges();

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
          this.hasArtistsWithoutCountry$.next(false);
        } else {
          this.hasArtistsWithoutCountry$.next(true);
          const scrapedArtists: ScrapedArtist[] = [];

          this.countryService.findArtistsCountryOfOrigin(artistsWithoutCountry).subscribe({
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
            },
          });
        }
      });
  }

  observeArtistsChanges(): void {
    this.userTopArtists$.subscribe((artists) => {
      this.countryService.updateCountriesCount(artists);
      this.countryService.updateRegionsCount(artists);
    });
  }

  getUserTopArtists(): Observable<Artist[]> {
    return this.userTopArtists$.asObservable();
  }

  getScrapedArtists(): Observable<ScrapedArtistData | undefined> {
    return this.scrapedArtists$.asObservable();
  }

  hasArtistsWithoutCountryStatus(): Observable<boolean | undefined> {
    return this.hasArtistsWithoutCountry$.asObservable();
  }

  getArtistsRequestStatus(): boolean {
    return this.hasRequestedTopArtists;
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
