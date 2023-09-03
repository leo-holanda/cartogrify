import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs";
import { ArtistsWithoutCountryStatus, ScrapedArtistData } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";

@Component({
  selector: "ctg-pre-journey",
  templateUrl: "./pre-journey.component.html",
  styleUrls: ["./pre-journey.component.scss"],
})
export class PreJourneyComponent implements OnInit {
  hasArtistsWithoutCountry!: boolean;
  artistsWithoutCountryQuantity = 0;

  hasCompletedArtistsSearch = false;
  scrapedArtistsData: ScrapedArtistData[] = [];

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.artistService
      .hasArtistsWithoutCountryStatus()
      .pipe(filter((status): status is ArtistsWithoutCountryStatus => status != undefined))
      .subscribe((status) => {
        if (!status.hasArtistsWithoutCountry) {
          this.router.navigate(["/journey/begin"]);
        } else {
          this.hasArtistsWithoutCountry = true;
          this.artistsWithoutCountryQuantity = status.artistsWithoutCountryQuantity;
        }
      });

    this.artistService
      .getScrapedArtists()
      .pipe(
        filter(
          (scrapedArtistData): scrapedArtistData is ScrapedArtistData =>
            scrapedArtistData !== undefined
        )
      )
      .subscribe((scrapedArtistData) => {
        this.scrapedArtistsData.unshift(scrapedArtistData);
        if (scrapedArtistData.remanining == scrapedArtistData.total) {
          setTimeout(() => {
            this.hasCompletedArtistsSearch = true;

            setTimeout(() => {
              this.router.navigate(["/journey/begin"]);
            }, 1000);
          }, 1000);
        }
      });
  }
}
