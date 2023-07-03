import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, convertToParamMap } from "@angular/router";
import { SpotifyService } from "../services/spotify.service";

@Component({
  selector: "app-authorization-gate",
  templateUrl: "./authorization-gate.component.html",
  styleUrls: ["./authorization-gate.component.scss"],
})
export class AuthorizationGateComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const paramMap = convertToParamMap(params);
      const code = paramMap.get("code");
      if (code) {
        this.spotifyService.requestAccessToken(code).subscribe(() => {
          this.router.navigate(["/worldmap"]);
        });
      }
    });
  }
}
