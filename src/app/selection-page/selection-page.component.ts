import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../services/spotify.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-selection-page",
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
        this.router.navigate(["/worldmap"]);
      });
    } else {
      this.router.navigate(["/worldmap"]);
    }
  }

  onLastfmButtonClick(): void {
    console.log("lastfm button clicked");
  }
}
