import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesDiversityComponent } from "./countries-diversity.component";
import { CountriesDiversityRankModule } from "src/app/artists/rankings/countries-diversity-rank/countries-diversity-rank.module";

@NgModule({
  declarations: [CountriesDiversityComponent],
  imports: [CommonModule, CountriesDiversityRankModule],
  exports: [CountriesDiversityComponent],
})
export class CountriesDiversityModule {}
