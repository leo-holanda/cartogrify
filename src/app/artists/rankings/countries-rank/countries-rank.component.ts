import { Component, Input, OnInit } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryData, DiversityStatistics } from "src/app/country/country.model";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent implements OnInit {
  @Input() countriesData!: CountryData[];
  @Input() artists!: Artist[];
  @Input() diversityStatistics!: DiversityStatistics;

  userDiversityPercentageText!: string;

  constructor() {}

  ngOnInit(): void {
    //TODO Use a service to get this data
    setTimeout(() => {
      const countriesCount = this.countriesData.length;
      const difference = Math.abs(this.diversityStatistics.average - this.countriesData.length);
      const userDiversityPercentage =
        ((difference / this.diversityStatistics.average) * 100).toPrecision(2).toString() + "%";
      if (countriesCount > this.diversityStatistics.average)
        this.userDiversityPercentageText = `Your country diversity is ${userDiversityPercentage} higher than our users average!`;
      else
        this.userDiversityPercentageText = `Your country diversity is ${userDiversityPercentage} lower than our users average!`;
    }, 3000);
  }
}
