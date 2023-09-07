import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, concat, map, take, tap } from "rxjs";
import { LastFmUser } from "../shared/supabase.model";
import { UserService } from "../user/user.service";
import { CountryService } from "../country/country.service";
import { ArtistService } from "../artists/artist.service";
import { ArtistsSources } from "../artists/artist.model";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
    private countryService: CountryService,
    private artistService: ArtistService
  ) {}

  loadUserData(userName: string): Observable<LastFmUser | string[]> {
    const loadUserProfile = this.getLastFmUserProfileData(userName).pipe(
      take(1),
      tap((userProfile) => {
        this.userService.setUser({
          id: userName,
          countryCode: this.countryService.getCountryCodeByText(userProfile.country),
        });
      })
    );

    const loadUserTopArtists = this.getTopArtists(userName).pipe(
      take(1),
      tap((topArtists) => {
        this.artistService.setSource(ArtistsSources.LASTFM);
        this.artistService.setUserTopArtists(topArtists);
      })
    );

    return concat(loadUserProfile, loadUserTopArtists);
  }

  getTopArtists(userName: string): Observable<string[]> {
    return this.supabaseService.getLastFmUserTopArtists(userName).pipe(
      take(1),
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.topartists) return response.topartists.artist.map((artist) => artist.name);
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      })
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
}
