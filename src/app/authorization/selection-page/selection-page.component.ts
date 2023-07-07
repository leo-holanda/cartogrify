import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyService } from "src/app/shared/spotify.service";

@Component({
  selector: "msm-selection-page",
  templateUrl: "./selection-page.component.html",
  styleUrls: ["./selection-page.component.scss"],
})
export class SelectionPageComponent {
  constructor(private spotifyService: SpotifyService, private router: Router) {}

  onSpotifyButtonClick(): void {
    if (this.spotifyService.isTokenUndefined()) {
      this.spotifyService.requestAuthorization();
    } else if (this.spotifyService.isTokenExpired()) {
      this.spotifyService.refreshToken().subscribe(() => {
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
