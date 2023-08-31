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
  scrapedArtistsData: ScrapedArtistData[] = [];

  constructor(private artistService: ArtistService, private router: Router) {}

  ngOnInit(): void {
    this.artistService
      .hasArtistsWithoutCountryStatus()
      .pipe(filter((status): status is boolean => status != undefined))
      .subscribe((hasArtistsWithoutCountry) => {
        if (!hasArtistsWithoutCountry) this.router.navigate(["/journey/begin"]);
        this.hasArtistsWithoutCountry = true;
      });

    this.artistService
      .getScrapedArtists()
      .pipe(filter((status): status is ScrapedArtistData => status !== undefined))
      .subscribe((scrapedArtist) => {
        this.scrapedArtistsData.push(scrapedArtist);
      });
  }
}
