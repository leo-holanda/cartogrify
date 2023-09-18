import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesDiversityComponent } from "./countries-diversity.component";
import { CountriesDiversityRankModule } from "src/app/artists/rankings/countries-diversity-rank/countries-diversity-rank.module";
import { CountriesPopularityRankModule } from "../countries-popularity-rank/countries-popularity-rank.module";

@NgModule({
  declarations: [CountriesDiversityComponent],
  imports: [CommonModule, CountriesDiversityRankModule, CountriesPopularityRankModule],
  exports: [CountriesDiversityComponent],
})
export class CountriesDiversityModule {}
