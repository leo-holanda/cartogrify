import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { SpotifyService } from "src/app/shared/spotify.service";

@Component({
  selector: "msm-authorization-gate",
  templateUrl: "./authorization-gate.component.html",
  styleUrls: ["./authorization-gate.component.scss"],
})
export class AuthorizationGateComponent implements OnInit {
  isStateUnequal = false;
  hasError = false;
  isAuthorized = false;

  constructor(
    private activatedRoute: ActivatedRoute,
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
          this.spotifyService.requestAccessToken(code).subscribe(() => {
            this.router.navigate(["/artists"]);
          });
        }
      }
    });
  }
}
