import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { LastFmService } from "src/app/streaming/last-fm.service";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { concatMap, of, switchMap, take } from "rxjs";
import { ArtistService } from "src/app/artists/artist.service";
import { ArtistsSources } from "src/app/artists/artist.model";

@Component({
  selector: "msm-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  lastFmUsername = "";
  hasInitiatedLogin = false;
  hasClickedLastFmButton = false;
  hasClickedLastFmStartButton = false;
  isSidebarVisible = false;

  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private spotifyService: SpotifyService,
    private lastFmService: LastFmService,
    private router: Router,
    private messageService: MessageService,
    private artistService: ArtistService
  ) {}

  onSpotifyButtonClick(): void {
    this.hasInitiatedLogin = true;

    this.spotifyAuthService
      .refreshToken()
      .pipe(
        take(1),
        concatMap(() => this.spotifyService.loadUserData())
      )
      .subscribe({
        complete: () => {
          this.router.navigate(["/journey/loading"]);
        },
        error: (err) => {
          this.handleSpotifyError(err);
        },
      });

    return;
  }

  onLastfmButtonClick(): void {
    this.hasInitiatedLogin = true;
    this.hasClickedLastFmButton = true;
  }

  onLastfmStartButtonClick(): void {
    this.hasClickedLastFmStartButton = true;
    this.lastFmService.loadUserData(this.lastFmUsername).subscribe({
      next: (topArtists) => {
        this.artistService.toggleArtistsRequestStatus();
        this.artistService.setSource(ArtistsSources.LASTFM);
        this.artistService.setUserTopArtists(topArtists);
      },
      complete: () => {
        this.router.navigate(["/journey/loading"]);
      },
      error: (err) => {
        this.resetLastFmLogin();
        this.showLastFmErrorMessage(err);
      },
    });
  }

  onLastfmUsernameDialogHide(): void {
    this.resetLastFmLogin();
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

    this.showSpotifyErrorMessage(errorMessage);
    this.hasInitiatedLogin = false;
  }

  private resetLastFmLogin(): void {
    this.hasInitiatedLogin = false;
    this.hasClickedLastFmButton = false;
    this.hasClickedLastFmStartButton = false;
    this.lastFmUsername = "";
  }

  private showLastFmErrorMessage(err: any): void {
    this.messageService.add({
      severity: "error",
      summary: "Communication with LastFM has failed.",
      detail: "Error: " + err.message,
      sticky: true,
    });
  }

  private showSpotifyErrorMessage(errorMessage: string): void {
    this.messageService.add({
      severity: "error",
      summary: "Communication with Spotify has failed.",
      detail: "Error: " + errorMessage,
      sticky: true,
    });
  }
}
