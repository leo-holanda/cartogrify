import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressBarModule } from "primeng/progressbar";
import { CountriesRankComponent } from "./countries-rank.component";

@NgModule({
  declarations: [CountriesRankComponent],
  imports: [CommonModule, ProgressBarModule],
  exports: [CountriesRankComponent],
})
export class CountriesRankModule {}
