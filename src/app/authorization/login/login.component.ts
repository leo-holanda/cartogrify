import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";

@Component({
  selector: "msm-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  constructor(private spotifyAuthService: SpotifyAuthService, private router: Router) {}

  onSpotifyButtonClick(): void {
    if (this.spotifyAuthService.isTokenUndefined()) {
      this.spotifyAuthService.requestAuthorization();
    } else if (this.spotifyAuthService.isTokenExpired()) {
      this.spotifyAuthService.refreshToken().subscribe(() => {
        this.router.navigate(["/artists"]);
      });
    } else {
      this.router.navigate(["/artists"]);
    }
  }

  onLastfmButtonClick(): void {
    console.log("lastfm button clicked");
  }
}
