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
  private hasRequestedTopArtists = false;

  constructor(private supabaseService: SupabaseService, private countryService: CountryService) {}

  setUserTopArtists(topArtistsNames: string[]): void {
    this.hasRequestedTopArtists = true;
    this.supabaseService
      .getBestSuggestionByArtists(topArtistsNames)
      .subscribe((bestSuggestions) => {
        const artists = this.transformSuggestionsInArtists(bestSuggestions);
        this.userTopArtists$.next(artists);

        const artistsWithoutCountry = this.findArtistsWithoutCountry(topArtistsNames, artists);
        if (artistsWithoutCountry.length > 0) {
          const scrappedArtists: ScrapedArtist[] = [];

          this.countryService.getArtistsCountryOfOrigin(artistsWithoutCountry).subscribe({
            next: (scrappedArtist) => {
              scrappedArtists.push(scrappedArtist);
              this.userTopArtists$.next([...artists, ...scrappedArtists]);
            },
            complete: () => this.supabaseService.saveSuggestions(scrappedArtists),
          });
        }
      });
  }

  getUserTopArtists(): Observable<Artist[] | undefined> {
    return this.userTopArtists$.asObservable();
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
}
