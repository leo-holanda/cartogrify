import { Injectable } from "@angular/core";
import { Artist, ArtistFromDatabase } from "./artist.model";
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
      const revivedArtists = this.loadArtistsCountry(artistsFromDatabase);
      this.userTopArtists$.next(revivedArtists);

      const artistsWithoutCountry = this.findArtistsWithoutCountry(topArtists, revivedArtists);
      if (artistsWithoutCountry.length > 0) {
        const scrappedArtists: Artist[] = [];
        this.countryService
          .getArtistsCountryOfOrigin(artistsWithoutCountry)
          .pipe(
            finalize(() =>
              this.supabaseService.saveArtists(scrappedArtists).subscribe((savedArtists) => {
                savedArtists.forEach((savedArtist) => {
                  let matchedArtist = revivedArtists.find(
                    (revivedArtists) => revivedArtists.name === savedArtist.name
                  );
                  matchedArtist = savedArtist;
                });
                this.userTopArtists$.next([...revivedArtists, ...savedArtists]);
              })
            )
          )
          .subscribe((artistWithCountry) => {
            scrappedArtists.push(artistWithCountry);
            this.userTopArtists$.next([...revivedArtists, ...scrappedArtists]);
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

  private loadArtistsCountry(artistsFromDatabase: ArtistFromDatabase[]): Artist[] {
    return artistsFromDatabase.map((artist) => {
      return {
        id: artist.id,
        name: artist.name,
        country: this.countryService.getCountryById(artist.country_id),
      } as Artist;
    });
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
