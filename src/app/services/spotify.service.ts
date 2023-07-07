import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, map, of, tap } from "rxjs";

interface SpotifyAccessTokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_at: Date;
}

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  clientId = "c8201434fef4436fb83dfa7bb2a7128d";
  redirectUri = "http://localhost:4200/authorization";

  constructor(private http: HttpClient) {}

  requestAuthorization(): void {
    const codeChallenge$ = this.generateCodeChallenge();
    const scope = "user-top-read";

    const state = this.generateRandomString(16);
    localStorage.setItem("state", state);

    codeChallenge$.subscribe((codeChallenge) => {
      const args = new URLSearchParams({
        response_type: "code",
        client_id: this.clientId,
        scope: scope,
        redirect_uri: this.redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      document.location.href = "https://accounts.spotify.com/authorize?" + args;
    });
  }

  requestAccessToken(code: string): Observable<SpotifyAccessTokenData> {
    let codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) {
      codeVerifier = this.generateRandomString(128);
      localStorage.setItem("code_verifier", codeVerifier);
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier,
    });

    return this.http
      .post<SpotifyAccessTokenData>("https://accounts.spotify.com/api/token", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(
        tap((tokenData) => {
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
          tokenData.expires_at = expiresAt;
          localStorage.setItem("token_data", JSON.stringify(tokenData));
        })
      );
  }

  getUserTopArtists(): Observable<SpotifyApi.UsersTopArtistsResponse> {
    const tokenDataItem = localStorage.getItem("token_data") as string;
    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;

    return this.http.get<SpotifyApi.UsersTopArtistsResponse>(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: "Bearer " + tokenData.access_token,
        },
      }
    );
  }

  isTokenUndefined(): boolean {
    const tokenDataItem = localStorage.getItem("token_data");
    if (!tokenDataItem) return true;

    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;
    return !tokenData.access_token;
  }

  isTokenExpired(): boolean {
    const tokenDataItem = localStorage.getItem("token_data");
    if (!tokenDataItem) return true;

    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;

    const now = new Date();
    return now >= new Date(tokenData.expires_at);
  }

  refreshToken(): Observable<SpotifyAccessTokenData> {
    const tokenDataItem = localStorage.getItem("token_data") as string;
    const tokenData = JSON.parse(tokenDataItem) as SpotifyAccessTokenData;
    const refreshToken = tokenData.refresh_token;

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
    });

    return this.http
      .post<SpotifyAccessTokenData>("https://accounts.spotify.com/api/token", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(
        tap((tokenData) => {
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
          tokenData.expires_at = expiresAt;
          localStorage.setItem("token_data", JSON.stringify(tokenData));
        })
      );
  }

  private generateRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  private base64encode(string: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(string)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  private generateCodeChallenge(): Observable<string> {
    const codeVerifier = this.generateRandomString(128);
    localStorage.setItem("code_verifier", codeVerifier);

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = from(window.crypto.subtle.digest("SHA-256", data));

    return digest.pipe(map((code) => this.base64encode(code)));
  }
}
