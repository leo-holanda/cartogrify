import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { ArtistService } from "src/app/artists/artist.service";
import { LastFmService } from "src/app/streaming/last-fm.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "msm-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  lastFmUsername = "";
  hasClickedSpotifyButton = false;
  hasClickedLastFmButton = false;

  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private lastFmService: LastFmService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSpotifyButtonClick(): void {
    this.hasClickedSpotifyButton = true;
    if (this.spotifyAuthService.isTokenUndefined()) {
      this.spotifyAuthService.requestAuthorization();
    } else if (this.spotifyAuthService.isTokenExpired()) {
      this.spotifyAuthService.refreshToken().subscribe(() => {
        this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
          this.artistService.setUserTopArtists(topArtists);
          this.router.navigate(["/artists"]);
        });
      });
    } else {
      this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
        this.artistService.setUserTopArtists(topArtists);
        this.router.navigate(["/artists"]);
      });
    }
  }

  onLastfmButtonClick(): void {
    this.hasClickedLastFmButton = true;
    this.lastFmService.getTopArtists(this.lastFmUsername).subscribe({
      next: (topArtists) => {
        this.artistService.setUserTopArtists(topArtists);
        this.router.navigate(["/artists"]);
      },
      error: (err) => {
        this.hasClickedSpotifyButton = false;
        this.hasClickedLastFmButton = false;
        this.messageService.add({
          severity: "error",
          summary: "Communication with LastFM has failed.",
          detail: "Error: " + err.message,
          life: 2000,
        });
      },
    });
  }
}
