import { Component, OnInit } from "@angular/core";
import { CountryPopularity } from "../../shared/supabase.model";
import { CountryService } from "../../country/country.service";

@Component({
  selector: "ctg-countries-popularity-rank",
  templateUrl: "./countries-popularity-rank.component.html",
  styleUrls: ["./countries-popularity-rank.component.scss"],
})
export class CountriesPopularityRankComponent implements OnInit {
  countriesPopularity: CountryPopularity[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.getCountriesPopularityRank();
  }

  getCountriesPopularityRank(): void {
    this.countryService.getCountriesPopularity().subscribe((countriesPopularity) => {
      this.countriesPopularity = countriesPopularity;
    });
  }
}
