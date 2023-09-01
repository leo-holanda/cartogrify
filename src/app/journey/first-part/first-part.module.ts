import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesRankModule } from "src/app/artists/rankings/countries-rank/countries-rank.module";
import { FirstPartComponent } from "./first-part.component";

@NgModule({
  declarations: [FirstPartComponent],
  imports: [CommonModule, CountriesRankModule],
  exports: [FirstPartComponent],
})
export class FirstPartModule {}
