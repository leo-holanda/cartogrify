import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesPopularityRankComponent } from "./countries-popularity-rank.component";

@NgModule({
  declarations: [CountriesPopularityRankComponent],
  imports: [CommonModule],
  exports: [CountriesPopularityRankComponent],
})
export class CountriesPopularityRankModule {}
