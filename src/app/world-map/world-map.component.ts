import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../services/spotify.service";
import { ArtistService } from "../services/artist.service";
import { WebScraperService } from "../services/web-scraper.service";

@Component({
  selector: "msm-world-map",
  templateUrl: "./world-map.component.html",
  styleUrls: ["./world-map.component.scss"],
})
export class WorldMapComponent implements OnInit {
  artists: any[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private artistService: ArtistService,
    private webScraper: WebScraperService
  ) {}

  ngOnInit(): void {
    this.spotifyService.getUserTopArtists().subscribe((topArtists) => {
      const topArtistsNames = topArtists.items.map((artist) => artist.name.toLowerCase());

      this.artistService.getArtists(topArtistsNames).subscribe((artistsFromDatabase) => {
        const artistsWithoutCountry = this.findArtistsWithoutCountry(
          topArtistsNames,
          artistsFromDatabase
        );

        console.log(artistsWithoutCountry);

        if (artistsWithoutCountry.length > 0) {
          this.webScraper.getArtistsCountryOfOrigin(artistsWithoutCountry).subscribe((data) => {
            this.artistService.saveArtist(data);
          });
        }
      });
    });
  }

  findArtistsWithoutCountry(
    topArtistsNames: string[],
    artistsFromDatabase: any[] | null
  ): string[] {
    return topArtistsNames.filter(
      (topArtistName) =>
        !artistsFromDatabase?.some(
          (artistsFromDatabase) => topArtistName === artistsFromDatabase.name
        )
    );
  }
}
