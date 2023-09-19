import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, concat, map, of, switchMap, take } from "rxjs";
import { SpotifyAccessTokenData } from "../authorization/spotify-auth.service";
import { SpotifyUserData } from "./spotify.model";
import { CountryService } from "../country/country.service";
import { UserService } from "../user/user.service";
import { ArtistService } from "../artists/artist.service";
import { ArtistsSources } from "../artists/artist.model";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(
    private http: HttpClient,
    private countryService: CountryService,
    private userService: UserService,
    private artistService: ArtistService
  ) {}

  loadUserData(): Observable<SpotifyUserData | string[]> {
    const loadUserProfile$ = this.getUserProfile().pipe(
      take(1),
      switchMap((userProfile) => {
        this.userService.setUser(userProfile);
        return of();
      })
    );

    const loadUserTopArtistsNames$ = this.getUserTopArtistsNames().pipe(
      take(1),
      switchMap((userTopArtistsNames) => {
        this.artistService.setSource(ArtistsSources.SPOTIFY);
        this.artistService.setUserTopArtistsNames(userTopArtistsNames);
        return of();
      })
    );

    return concat(loadUserProfile$, loadUserTopArtistsNames$);
  }

  getUserTopArtistsNames(): Observable<string[]> {
    const tokenDataItem = localStorage.getItem("token_data") as string;
    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;

    return this.http
      .get<SpotifyApi.UsersTopArtistsResponse>("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: "Bearer " + tokenData.access_token,
        },
      })
      .pipe(
        take(1),
        map((response) => response.items.map((artist) => artist.name))
      );
  }

  getUserProfile(): Observable<SpotifyUserData> {
    const tokenDataItem = localStorage.getItem("token_data") as string;
    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;

    return this.http
      .get<SpotifyApi.CurrentUsersProfileResponse>("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + tokenData.access_token,
        },
      })
      .pipe(
        take(1),
        map((response) => {
          return {
            id: response.id,
            countryCode: this.countryService.getCountryCodeByText(response.country),
          } as SpotifyUserData;
        })
      );
  }
}
