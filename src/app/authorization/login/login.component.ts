import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { LastFmService } from "src/app/streaming/last-fm.service";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { of, switchMap } from "rxjs";

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
    private messageService: MessageService
  ) {}

  onSpotifyButtonClick(): void {
    this.hasInitiatedLogin = true;

    if (this.spotifyAuthService.isTokenUndefined()) {
      this.spotifyAuthService.requestAuthorization();
      return;
    }

    if (this.spotifyAuthService.isTokenExpired()) {
      this.spotifyAuthService
        .refreshToken()
        .pipe(
          switchMap(() => {
            this.spotifyService.loadUserData();
            return of();
          })
        )
        .subscribe({
          complete: () => {
            this.router.navigate(["/journey"]);
          },
          error: (err) => {
            this.handleSpotifyError(err);
          },
        });

      return;
    }

    this.fetchUserDataFromSpotify();
  }

  onLastfmButtonClick(): void {
    this.hasInitiatedLogin = true;
    this.hasClickedLastFmButton = true;
  }

  onLastfmStartButtonClick(): void {
    this.hasClickedLastFmStartButton = true;
    this.lastFmService.loadUserData(this.lastFmUsername).subscribe({
      complete: () => {
        this.router.navigate(["/journey"]);
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

  private fetchUserDataFromSpotify(): void {
    this.spotifyService.loadUserData().subscribe({
      complete: () => {
        this.router.navigate(["/journey"]);
      },
      error: (err) => {
        this.handleSpotifyError(err);
      },
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
