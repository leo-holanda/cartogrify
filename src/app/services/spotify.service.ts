import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, map, tap } from "rxjs";

interface SpotifyAccessTokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  clientId = "c8201434fef4436fb83dfa7bb2a7128d";
  redirectUri = "http://localhost:4200/authorization";
  codeVerifier = "";
  accessToken = "";

  constructor(private http: HttpClient) {
    const storedCodeVerifier = localStorage.getItem("code_verifier");
    const storedAccessToken = localStorage.getItem("access_token");

    if (storedCodeVerifier) {
      this.codeVerifier = storedCodeVerifier;
    } else {
      this.codeVerifier = this.generateRandomString(128);
      localStorage.setItem("code_verifier", this.codeVerifier);
    }

    if (storedAccessToken) this.accessToken = storedAccessToken;
  }

  generateRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  base64encode(string: ArrayBuffer) {
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(string)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  generateCodeChallenge(): Observable<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(this.codeVerifier);
    const digest = from(window.crypto.subtle.digest("SHA-256", data));

    return digest.pipe(map((code) => this.base64encode(code)));
  }

  requestAuthorization(): Observable<string> {
    const codeChallenge$ = this.generateCodeChallenge();
    const state = this.generateRandomString(16);
    const scope = "user-read-private user-read-email";

    return codeChallenge$.pipe(
      tap((codeChallenge) => {
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
      })
    );
  }

  requestAccessToken(code: string): Observable<string> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: this.codeVerifier,
    });

    return this.http
      .post<SpotifyAccessTokenData>("https://accounts.spotify.com/api/token", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(
        map((tokenData) => tokenData.access_token),
        tap((token) => {
          this.accessToken = token;
          localStorage.setItem("access_token", this.accessToken);
        })
      );
  }
}
