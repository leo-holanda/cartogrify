import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { ArtistService } from "src/app/artists/artist.service";
import { LastFmService } from "src/app/streaming/last-fm.service";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "msm-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  lastFmUsername = "";
  hasClickedSpotifyButton = false;
  hasClickedLastFmButton = false;
  hasClickedLastFmStartButton = false;

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
      return;
    }

    if (this.spotifyAuthService.isTokenExpired()) {
      this.spotifyAuthService.refreshToken().subscribe({
        next: () => this.fetchUserDataFromSpotify,
        error: (err) => this.handleSpotifyError(err),
      });
      return;
    }

    this.fetchUserDataFromSpotify();
  }

  onLastfmButtonClick(): void {
    this.hasClickedLastFmButton = true;
  }

  onLastfmStartButtonClick(): void {
    this.hasClickedLastFmStartButton = true;
    this.lastFmService.getTopArtists(this.lastFmUsername).subscribe({
      next: (topArtists) => {
        this.artistService.setUserTopArtists(topArtists);
        this.router.navigate(["/artists"]);
      },
      error: (err) => {
        this.hasClickedSpotifyButton = false;
        this.hasClickedLastFmButton = false;
        this.hasClickedLastFmStartButton = false;
        this.lastFmUsername = "";
        this.messageService.add({
          severity: "error",
          summary: "Communication with LastFM has failed.",
          detail: "Error: " + err.message,
          sticky: true,
        });
      },
    });
  }

  private fetchUserDataFromSpotify(): void {
    this.spotifyService.getUserTopArtists().subscribe({
      next: (topArtists) => {
        this.artistService.setUserTopArtists(topArtists);
        this.router.navigate(["/artists"]);
      },
      error: this.handleSpotifyError,
    });
  }

  private handleSpotifyError(err: HttpErrorResponse): void {
    let errorMessage = "";
    if (err.error && err.error.error) {
      errorMessage = err.error.error.message;
    } else {
      errorMessage =
        err.message ||
        "It was not possible to get info about the error. Please, report it as a GitHub issue in the repository.";
    }

    this.messageService.add({
      severity: "error",
      summary: "Communication with Spotify has failed.",
      detail: "Error: " + errorMessage,
      sticky: true,
    });

    this.hasClickedSpotifyButton = false;
  }
}
