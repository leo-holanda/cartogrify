import { Component, OnInit } from "@angular/core";
import { CountryService } from "src/app/country/country.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { DiversityIndex } from "src/app/shared/supabase.model";
import { UserService } from "src/app/user/user.service";
import { User } from "src/app/user/user.model";
import { Country } from "src/app/country/country.model";

@Component({
  selector: "ctg-countries-stats",
  templateUrl: "./countries-stats.component.html",
  styleUrls: ["./countries-stats.component.scss"],
})
export class CountriesStatsComponent implements OnInit {
  user!: User;
  userCountry!: Country | undefined;

  diversityIndexes: DiversityIndex[] | undefined;
  comparedDiversityData: ComparedDiversityData | undefined;

  diversityIndexesInUserCountry: DiversityIndex[] | undefined;
  comparedDiversityDataInUserCountry: ComparedDiversityData | undefined;

  constructor(
    private statisticsSevice: StatisticsService,
    private countryService: CountryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.userCountry = this.countryService.getCountryByCode(this.user.countryCode);

    this.countryService.getCountriesCount().subscribe((userCountriesCount) => {
      this.statisticsSevice.getDiversityIndexes().subscribe((diversityIndexes) => {
        this.diversityIndexes = diversityIndexes;
      });

      this.statisticsSevice
        .getComparedDiversity(userCountriesCount.length)
        .subscribe((comparedDiversityData) => {
          this.comparedDiversityData = comparedDiversityData;
        });

      if (this.user.countryCode) {
        this.statisticsSevice
          .getComparedDiversityInUserCountry(userCountriesCount.length, this.user.countryCode)
          .subscribe((comparedDiversityDataInUserCountry) => {
            this.comparedDiversityDataInUserCountry = comparedDiversityDataInUserCountry;
          });

        this.statisticsSevice
          .getDiversityIndexesInUserCountry(this.user.countryCode)
          .subscribe((diversityIndexesInUserCountry) => {
            this.diversityIndexesInUserCountry = diversityIndexesInUserCountry;
          });
      }
    });
  }
}