import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";

@Component({
  selector: "msm-post-login",
  templateUrl: "./post-login.component.html",
  styleUrls: ["./post-login.component.scss"],
})
export class PostLoginComponent implements OnInit {
  isStateUnequal = false;
  hasError = false;
  isAuthorized = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
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
          this.spotifyAuthService.requestAccessToken(code).subscribe(() => {
            this.router.navigate(["/artists"]);
          });
        }
      }
    });
  }
}
