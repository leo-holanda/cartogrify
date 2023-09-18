import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesPopularityRankComponent } from "./countries-popularity-rank.component";
import { ProgressBarModule } from "primeng/progressbar";

@NgModule({
  declarations: [CountriesPopularityRankComponent],
  imports: [CommonModule, ProgressBarModule],
  exports: [CountriesPopularityRankComponent],
})
export class CountriesPopularityRankModule {}
