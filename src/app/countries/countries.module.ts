import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CountriesService } from "./countries.service";

@NgModule({
  declarations: [],
  providers: [CountriesService],
  imports: [CommonModule],
})
export class CountriesModule {}
