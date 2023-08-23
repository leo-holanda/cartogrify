import { Injectable } from "@angular/core";
import { Artist, ArtistFromDatabase, ScrapedArtist, Suggestion } from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { BehaviorSubject, Observable, finalize } from "rxjs";
import { CountryService } from "../country/country.service";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private userTopArtists$ = new BehaviorSubject<Artist[] | undefined>(undefined);
  private scrappedArtists$ = new BehaviorSubject<Artist | undefined>(undefined);
  private hasArtistsWithoutCountry$ = new BehaviorSubject<boolean | undefined>(undefined);

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
        if (artistsWithoutCountry.length > 0) {
          this.hasArtistsWithoutCountry$.next(true);
          const scrappedArtists: ScrapedArtist[] = [];

          this.countryService.getArtistsCountryOfOrigin(artistsWithoutCountry).subscribe({
            next: (scrappedArtist) => {
              this.scrappedArtists$.next(scrappedArtist);

              scrappedArtists.push(scrappedArtist);
              const userTopArtists = this.applyOriginalOrder(topArtistsNames, [
                ...artistsFromDatabase,
                ...scrappedArtists,
              ]);
              this.userTopArtists$.next(userTopArtists);
            },
            complete: () => {
              this.supabaseService.saveSuggestions(scrappedArtists);
              this.scrappedArtists$.complete();
            },
          });
        }
      });
  }

  getUserTopArtists(): Observable<Artist[] | undefined> {
    return this.userTopArtists$.asObservable();
  }

  getScrappedArtists(): Observable<Artist | undefined> {
    return this.scrappedArtists$.asObservable();
  }

  getArtistsWithoutCountryStatus(): Observable<boolean | undefined> {
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

  private findArtistsWithoutCountry(topArtistsNames: string[], artists: Artist[] | null): string[] {
    return topArtistsNames.filter(
      (topArtistName) => !artists?.some((artists) => topArtistName === artists.name)
    );
  }

  private applyOriginalOrder(topArtistsNames: string[], artistsFromDatabase: Artist[]): Artist[] {
    return topArtistsNames
      .map((artistName) => artistsFromDatabase.find((artist) => artist.name == artistName))
      .filter((artist) => artist) as Artist[];
  }
}
