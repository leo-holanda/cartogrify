import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesRankModule } from "src/app/artists/rankings/countries-rank/countries-rank.module";
import { FirstActComponent } from "./first-act.component";

@NgModule({
  declarations: [FirstActComponent],
  imports: [CommonModule, CountriesRankModule],
  exports: [FirstActComponent],
})
export class FirstActModule {}
