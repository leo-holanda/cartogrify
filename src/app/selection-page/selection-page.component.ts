import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../services/spotify.service";

@Component({
  selector: "app-selection-page",
  templateUrl: "./selection-page.component.html",
  styleUrls: ["./selection-page.component.scss"],
})
export class SelectionPageComponent {
  constructor(private spotifyService: SpotifyService) {}

  onSpotifyButtonClick(): void {
    this.spotifyService.requestAuthorization().subscribe((data) => {
      console.log(data);
    });
  }

  onLastfmButtonClick(): void {
    console.log("lastfm button clicked");
  }
}
