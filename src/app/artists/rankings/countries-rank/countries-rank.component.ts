import { Component, OnInit } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryCount } from "src/app/country/country.model";
import { ArtistService } from "../../artist.service";
import { CountryService } from "src/app/country/country.service";
import { StatisticsService } from "src/app/statistics/statistics.service";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent implements OnInit {
  artists: Artist[] = [];
  countriesCount: CountryCount[] = [];
  comparedDiversity!: string;

  constructor(
    private artistService: ArtistService,
    private countryService: CountryService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => {
      this.artists = artists;
    });

    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;

      this.statisticsService
        .getComparedDiversity(this.countriesCount.length)
        .subscribe((diversityAverage) => {
          this.comparedDiversity = diversityAverage;
        });
    });
  }
}
