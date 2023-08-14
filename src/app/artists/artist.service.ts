import { Injectable } from "@angular/core";
import { Artist } from "./artist.model";
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

  setUserTopArtists(topArtists: string[]): void {
    this.hasRequestedTopArtists = true;
    this.supabaseService.getArtistsByName(topArtists).subscribe((artistsFromDatabase) => {
      this.userTopArtists$.next(artistsFromDatabase);
      const artistsWithoutCountry = this.findArtistsWithoutCountry(topArtists, artistsFromDatabase);

      if (artistsWithoutCountry.length > 0) {
        const scrappedArtists: Artist[] = [];
        this.countryService
          .getArtistsCountryOfOrigin(artistsWithoutCountry)
          .pipe(
            finalize(() =>
              this.supabaseService.saveArtists(scrappedArtists).subscribe((savedArtists) => {
                savedArtists.forEach((savedArtist) => {
                  let matchedArtist = artistsFromDatabase.find(
                    (artistFromDatabase) => artistFromDatabase.name === savedArtist.name
                  );
                  matchedArtist = savedArtist;
                });
                this.userTopArtists$.next([...artistsFromDatabase, ...savedArtists]);
              })
            )
          )
          .subscribe((artistWithCountry) => {
            scrappedArtists.push(artistWithCountry);
            this.userTopArtists$.next([...artistsFromDatabase, ...scrappedArtists]);
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

  private findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: Artist[] | null
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase?.some(
          (artistsFromDatabase) => topArtistName === artistsFromDatabase.name
        )
    );
  }
}
