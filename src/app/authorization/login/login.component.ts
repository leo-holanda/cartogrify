import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { ArtistService } from "src/app/artists/artist.service";
import { LastFmService } from "src/app/streaming/last-fm.service";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { UserService } from "src/app/user/user.service";
import { User } from "src/app/user/user.model";
import { CountryService } from "src/app/country/country.service";

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
    private artistService: ArtistService,
    private lastFmService: LastFmService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService,
    private countryService: CountryService
  ) {}

  onSpotifyButtonClick(): void {
    this.hasInitiatedLogin = true;

    if (this.spotifyAuthService.isTokenUndefined()) {
      this.spotifyAuthService.requestAuthorization();
      return;
    }

    if (this.spotifyAuthService.isTokenExpired()) {
      this.spotifyAuthService.refreshToken().subscribe({
        next: () => {
          this.fetchUserDataFromSpotify();
        },
        error: (err) => this.handleSpotifyError(err),
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
    this.lastFmService.getLastFmUserProfileData(this.lastFmUsername).subscribe({
      next: (lastFmUserProfileData) => {
        const currentUser: User = {
          id: this.lastFmUsername,
          countryCode: this.countryService.getCountryCodeByText(lastFmUserProfileData.country),
        };
        this.userService.setUser(currentUser);

        this.lastFmService.getTopArtists(this.lastFmUsername).subscribe({
          next: (topArtists) => {
            this.artistService.setUserTopArtists(topArtists);
            this.router.navigate(["/journey"]);
          },
          error: (err) => {
            this.hasInitiatedLogin = false;
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
      },
      error: (err) => {
        this.hasInitiatedLogin = false;
        this.hasClickedLastFmButton = false;
        this.hasClickedLastFmStartButton = false;
        this.lastFmUsername = "";
        this.messageService.add({
          severity: "error",
          summary: "It was not possible to fetch your profile data from Last.fm API.",
          detail: "Error: " + err.message,
          sticky: true,
        });
      },
    });
  }

  onLastfmUsernameDialogHide(): void {
    this.hasInitiatedLogin = false;
    this.hasClickedLastFmButton = false;
  }

  private fetchUserDataFromSpotify(): void {
    this.spotifyService.getUserProfileData().subscribe({
      next: (userProfileData) => {
        this.userService.setUser(userProfileData);
        this.spotifyService.getUserTopArtists().subscribe({
          next: (topArtists) => {
            this.artistService.setUserTopArtists(topArtists);
            this.router.navigate(["/journey"]);
          },
          error: (err) => this.handleSpotifyError(err),
        });
      },
      error: (err) => this.handleSpotifyError(err),
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

    this.hasInitiatedLogin = false;
  }
}
