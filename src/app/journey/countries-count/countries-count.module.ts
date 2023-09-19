import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesCountComponent } from "./countries-count.component";
import { CountriesRankModule } from "src/app/country/countries-rank/countries-rank.module";

@NgModule({
  declarations: [CountriesCountComponent],
  imports: [CommonModule, CountriesRankModule],
  exports: [CountriesCountComponent],
})
export class CountriesCountModule {}
