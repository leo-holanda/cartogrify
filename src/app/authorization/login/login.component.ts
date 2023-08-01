import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyAuthService } from "../spotify-auth.service";
import { SpotifyService } from "src/app/streaming/spotify.service";
import { ArtistService } from "src/app/artists/artist.service";
import { LastFmService } from "src/app/streaming/last-fm.service";

@Component({
  selector: "msm-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  lastFmUsername = "";

  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private lastFmService: LastFmService,
    private router: Router
  ) {}

  onSpotifyButtonClick(): void {
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
    this.lastFmService.getTopArtists(this.lastFmUsername).subscribe((topArtists) => {
      this.artistService.setUserTopArtists(topArtists);
      this.router.navigate(["/artists"]);
    });
  }
}
