import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { ArtistService } from "src/app/artists/artist.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UserService } from "src/app/user/user.service";
import { ArtistsSources } from "src/app/artists/artist.model";

@Component({
  selector: "msm-post-login",
  templateUrl: "./post-login.component.html",
  styleUrls: ["./post-login.component.scss"],
})
export class PostLoginComponent implements OnInit {
  isStateUnequal = false;
  hasError = false;
  isAuthorized = false;
  hasRequestError = false;
  requestErrorMessage = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private artistService: ArtistService,
    private spotifyService: SpotifyService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const paramMap = convertToParamMap(params);

      const state = paramMap.get("state");
      const storedState = localStorage.getItem("state");
      if (!storedState || state !== storedState) {
        this.isStateUnequal = true;
      } else {
        const error = paramMap.get("error");
        if (error) this.hasError = true;

        const code = paramMap.get("code");
        if (code) {
          this.isAuthorized = true;
          this.spotifyAuthService.requestAccessToken(code).subscribe({
            next: () => {
              this.spotifyService.getUserProfileData().subscribe({
                next: (userProfileData) => {
                  this.userService.setUser(userProfileData);
                  this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
                    this.artistService.setSource(ArtistsSources.SPOTIFY);
                    this.artistService.setUserTopArtists(topArtists);
                    this.router.navigate(["/journey"]);
                  });
                },
                error: (err) => this.handleSpotifyError(err),
              });
            },
            error: (err) => this.handleSpotifyError(err),
          });
        }
      }
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

    this.requestErrorMessage = errorMessage;
  }
}
