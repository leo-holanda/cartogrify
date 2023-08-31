import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesRankComponent } from "./countries-rank.component";
import { ProgressBarModule } from "primeng/progressbar";

@NgModule({
  declarations: [CountriesRankComponent],
  imports: [CommonModule, ProgressBarModule],
  exports: [CountriesRankComponent],
})
export class CountriesRankModule {}
