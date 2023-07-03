import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { Observable, from, map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  clientId = "c8201434fef4436fb83dfa7bb2a7128d";
  redirectUri = "http://localhost:4200/";

  constructor(private location: Location) {}

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

  generateCodeChallenge(codeVerifier: string): Observable<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = from(window.crypto.subtle.digest("SHA-256", data));

    return digest.pipe(map((code) => this.base64encode(code)));
  }

  requestAuthorization(): Observable<string> {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge$ = this.generateCodeChallenge(codeVerifier);
    const state = this.generateRandomString(16);
    const scope = "user-read-private user-read-email";

    localStorage.setItem("code_verifier", codeVerifier);

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
}
