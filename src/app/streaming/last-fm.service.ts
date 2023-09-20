import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map, switchMap, take } from "rxjs";
import { LastFmArtist, LastFmUser } from "../shared/supabase.model";
import { UserService } from "../user/user.service";
import { CountryService } from "../country/country.service";
import { ArtistService } from "../artists/artist.service";
import { Artist } from "../artists/artist.model";
import { Country } from "../country/country.model";
import { transformNamesInArtists } from "../artists/artist.helpers";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
    private countryService: CountryService
  ) {
    this.getLastFmArtistCountry("Djavan").subscribe((data) => {
      console.log(data);
    });
  }

  loadUserData(userName: string): Observable<Artist[]> {
    return this.getLastFmUserProfileData(userName).pipe(
      switchMap((userProfile) => {
        this.userService.setUser({
          id: userName,
          countryCode: this.countryService.getCountryCodeByText(userProfile.country),
        });

        return this.getTopArtists(userName);
      })
    );
  }

  getTopArtists(userName: string): Observable<Artist[]> {
    return this.supabaseService.getLastFmUserTopArtists(userName).pipe(
      take(1),
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.topartists) return response.topartists.artist.map((artist) => artist.name);
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      }),
      map((topArtistsNames) => transformNamesInArtists(topArtistsNames))
    );
  }

  getLastFmUserProfileData(userName: string): Observable<LastFmUser> {
    return this.supabaseService.getLastFmUserProfileData(userName).pipe(
      take(1),
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.user) return response.user;
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      })
    );
  }

  getLastFmArtistData(artistName: string): Observable<LastFmArtist> {
    return this.supabaseService.getLastFmArtistData(artistName).pipe(
      take(1),
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.artist) return response.artist;
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      })
    );
  }

  getLastFmArtistCountry(artistName: string): Observable<Country | undefined> {
    return this.getLastFmArtistData(artistName).pipe(
      map((artistData) => this.countryService.determineLastFmArtistCountry(artistData))
    );
  }
}
