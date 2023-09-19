import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesRanksComponent } from "./countries-ranks.component";
import { CountriesDiversityRankModule } from "src/app/artists/rankings/countries-diversity-rank/countries-diversity-rank.module";
import { CountriesPopularityRankModule } from "src/app/country/countries-popularity-rank/countries-popularity-rank.module";

@NgModule({
  declarations: [CountriesRanksComponent],
  imports: [CommonModule, CountriesDiversityRankModule, CountriesPopularityRankModule],
  exports: [CountriesRanksComponent],
})
export class CountriesRanksModule {}
