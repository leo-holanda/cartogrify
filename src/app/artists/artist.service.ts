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
    this.supabaseService.getArtistsByName(topArtistsNames).subscribe((artistsFromDatabase) => {
      const revivedArtists = this.loadArtistsCountry(artistsFromDatabase);
      this.userTopArtists$.next(revivedArtists);

      const artistsWithoutCountry = this.findArtistsWithoutCountry(topArtistsNames, revivedArtists);
      if (artistsWithoutCountry.length > 0)
        this.handleArtistsWithoutCountry(artistsWithoutCountry, revivedArtists);
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

  private handleArtistsWithoutCountry(
    artistsWithoutCountry: string[],
    revivedArtists: Artist[]
  ): void {
    const scrappedArtists: ScrapedArtist[] = [];

    this.countryService
      .getArtistsCountryOfOrigin(artistsWithoutCountry)
      .pipe(
        finalize(() => {
          const scrappedArtistsNames = scrappedArtists.map((scrappedArtist) => scrappedArtist.name);
          this.supabaseService.saveArtists(scrappedArtistsNames).subscribe((savedArtists) => {
            const savedArtistsWithCountry = savedArtists.map((savedArtist) => {
              return {
                id: savedArtist.id,
                name: savedArtist.name,
                country: scrappedArtists.find(
                  (scrapedArtist) => scrapedArtist.name == savedArtist.name
                )?.country,
              } as Artist;
            });

            this.userTopArtists$.next([...revivedArtists, ...savedArtistsWithCountry]);

            const suggestions = savedArtistsWithCountry.map((artist) => {
              return {
                artist: artist,
                suggestedCountry: artist.country,
              } as Suggestion;
            });
            this.supabaseService.saveSuggestions(suggestions);
          });
        })
      )
      .subscribe((artistWithCountry) => {
        scrappedArtists.push(artistWithCountry);
        this.userTopArtists$.next([...revivedArtists, ...scrappedArtists]);
      });
  }
}
