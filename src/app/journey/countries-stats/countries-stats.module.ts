import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesStatsComponent } from "./countries-stats.component";

@NgModule({
  declarations: [CountriesStatsComponent],
  imports: [CommonModule],
  exports: [CountriesStatsComponent],
})
export class CountriesStatsModule {}
