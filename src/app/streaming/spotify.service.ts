import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, take } from "rxjs";
import { SpotifyAccessTokenData } from "../authorization/spotify-auth.service";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getUserTopArtists(): Observable<string[]> {
    const tokenDataItem = localStorage.getItem("token_data") as string;
    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;

    return this.http
      .get<SpotifyApi.UsersTopArtistsResponse>(
        "https://api.spotify.com/v1/me/top/artists?limit=50",
        {
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
          },
        }
      )
      .pipe(
        take(1),
        map((response) => response.items.map((artist) => artist.name))
      );
  }
}
