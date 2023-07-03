import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../services/spotify.service";

@Component({
  selector: "app-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.scss"],
})
export class WorldMapComponent implements OnInit {
  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.getTopArtistsNames().subscribe((artistsNames) => {
      console.log(artistsNames);
    });
  }
}
