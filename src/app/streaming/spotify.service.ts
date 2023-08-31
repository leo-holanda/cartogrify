import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, take } from "rxjs";
import { SpotifyAccessTokenData } from "../authorization/spotify-auth.service";
import { SpotifyUserData } from "./spotify.model";
import { CountryService } from "../country/country.service";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(private http: HttpClient, private countryService: CountryService) {}

  getUserTopArtists(): Observable<string[]> {
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

  getUserProfileData(): Observable<SpotifyUserData> {
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
