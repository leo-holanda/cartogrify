import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../services/spotify.service";
import { ArtistService } from "../services/artist.service";
import { WebScraperService } from "../services/web-scraper.service";

@Component({
  selector: "app-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.scss"],
})
export class WorldMapComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private webScraper: WebScraperService
  ) {}

  ngOnInit(): void {
    this.spotifyService.getTopArtistsNames().subscribe((topArtistsNames) => {
      this.artistService.getArtistsData(topArtistsNames).subscribe((artistsData) => {
        const artistsWithUndefinedCountry = topArtistsNames.filter((name) =>
          artistsData?.some((artist) => artist.name !== name.toLocaleLowerCase())
        );

        if (artistsWithUndefinedCountry.length > 0) {
          this.webScraper
            .getArtistsCountryOfOrigin(artistsWithUndefinedCountry)
            .subscribe((data) => {
              console.log(data);
            });
        }
      });
    });
  }
}
