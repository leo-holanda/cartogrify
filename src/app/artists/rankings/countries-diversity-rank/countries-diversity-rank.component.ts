import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs";
import { CountryService } from "src/app/country/country.service";
import { DiversityIndex } from "src/app/shared/supabase.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { CountryDiversityData } from "./countries-diversity-rank.types";

@Component({
  selector: "ctg-countries-diversity-rank",
  templateUrl: "./countries-diversity-rank.component.html",
  styleUrls: ["./countries-diversity-rank.component.scss"],
})
export class CountriesDiversityRankComponent implements OnInit {
  countriesDiversity: CountryDiversityData[] = [];

  constructor(
    private statisticsService: StatisticsService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.getCountriesDiversityRank();
  }

  getCountriesDiversityRank(): void {
    this.statisticsService
      .getDiversityIndexes()
      .pipe(
        filter(
          (diversityIndexes): diversityIndexes is DiversityIndex[] => diversityIndexes != undefined
        )
      )
      .subscribe((diversityIndexes) => {
        const diversityPerCountry = new Map<number, CountryDiversityData>();

        diversityIndexes.forEach((index) => {
          if (index.countryCode) {
            const indexCountry = this.countryService.getCountryByCode(index.countryCode);

            const currentIndexCountryValue: CountryDiversityData = diversityPerCountry.get(
              index.countryCode
            ) || {
              name: indexCountry.name,
              flagCode: indexCountry.flagCode,
              totalCountries: 0,
              totalUsers: 0,
            };

            currentIndexCountryValue.totalCountries +=
              index.countriesCount * index.occurrenceQuantity;
            currentIndexCountryValue.totalUsers += index.occurrenceQuantity;

            diversityPerCountry.set(index.countryCode, currentIndexCountryValue);
          }
        });

        const array = [...diversityPerCountry.values()];
        array.sort((a, b) => {
          return a.totalCountries / a.totalUsers > b.totalCountries / b.totalUsers ? -1 : 1;
        });

        this.countriesDiversity = [...array];
      });
  }
}
