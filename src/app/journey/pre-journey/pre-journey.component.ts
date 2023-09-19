import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs";
import { ScrapedArtistData } from "src/app/artists/artist.model";
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

  progressBarMode = "indeterminate";
  progressPercentage = 0;

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.artistService
      .getArtistsWithoutCountryQuantity()
      .pipe(filter((quantity): quantity is number => quantity != undefined))
      .subscribe((quantity) => {
        if (quantity == 0) {
          this.router.navigate(["/journey"]);
        } else {
          this.hasArtistsWithoutCountry = true;
          this.artistsWithoutCountryQuantity = quantity;
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
        this.progressBarMode = "determinate";
        this.scrapedArtistsData.unshift(scrapedArtistData);

        this.progressPercentage = (scrapedArtistData.remanining / scrapedArtistData.total) * 100;
        this.artistsWithoutCountryQuantity -= 1;
        if (scrapedArtistData.remanining == scrapedArtistData.total) {
          setTimeout(() => {
            this.hasCompletedArtistsSearch = true;

            setTimeout(() => {
              this.router.navigate(["/journey"]);
            }, 1000);
          }, 1000);
        }
      });
  }
}
