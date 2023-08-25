import { Component, Input } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryData } from "src/app/country/country.model";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent {
  @Input() countriesData!: CountryData[];
  @Input() artists!: Artist[];
}
