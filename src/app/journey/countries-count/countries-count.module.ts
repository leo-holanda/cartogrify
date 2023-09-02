import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesRankModule } from "src/app/artists/rankings/countries-rank/countries-rank.module";
import { CountriesCountComponent } from "./countries-count.component";

@NgModule({
  declarations: [CountriesCountComponent],
  imports: [CommonModule, CountriesRankModule],
  exports: [CountriesCountComponent],
})
export class CountriesCountModule {}
