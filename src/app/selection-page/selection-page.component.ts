import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-selection-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selection-page.component.html",
  styleUrls: ["./selection-page.component.scss"],
})
export class SelectionPageComponent {
  onSpotifyButtonClick(): void {
    console.log("spotify button clicked");
  }

  onLastfmButtonClick(): void {
    console.log("lastfm button clicked");
  }
}
