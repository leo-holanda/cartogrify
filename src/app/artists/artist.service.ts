import { Injectable } from "@angular/core";
import { Artist } from "./artist.model";
import { SupabaseService } from "../shared/supabase.service";
import { CountriesService } from "../countries/countries.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private userTopArtists$ = new BehaviorSubject<Artist[] | undefined>(undefined);

  constructor(
    private supabaseService: SupabaseService,
    private countriesService: CountriesService
  ) {}

  setUserTopArtists(topArtists: string[]): void {
    this.supabaseService.getArtistsByName(topArtists).subscribe((artistsFromDatabase) => {
      const artistsWithoutCountry = this.findArtistsWithoutCountry(topArtists, artistsFromDatabase);
      if (artistsWithoutCountry.length > 0) {
        this.countriesService
          .getArtistsCountryOfOrigin(artistsWithoutCountry)
          .subscribe((scrapedArtists) => {
            this.userTopArtists$.next([...artistsFromDatabase, ...scrapedArtists]);
          });
      } else {
        this.userTopArtists$.next(artistsFromDatabase);
      }
    });
  }

  getUserTopArtists(): Observable<Artist[] | undefined> {
    return this.userTopArtists$.asObservable();
  }

  private findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: Artist[] | null
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase?.some(
          (artistsFromDatabase) => topArtistName.toLowerCase() === artistsFromDatabase.name
        )
    );
  }
}
