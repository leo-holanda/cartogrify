import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { HttpErrorResponse } from "@angular/common/http";

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
    private spotifyService: SpotifyService,
    private router: Router
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
              this.spotifyService.loadUserData().subscribe({
                complete: () => {
                  this.router.navigate(["/journey/loading"]);
                },
                error: (err) => {
                  this.handleSpotifyError(err);
                },
              });
            },
            error: (err) => {
              this.handleSpotifyError(err);
            },
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
