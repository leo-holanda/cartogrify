import { Component, Input } from "@angular/core";
import { RegionData } from "src/app/country/country.model";

@Component({
  selector: "ctg-regions-rank",
  templateUrl: "./regions-rank.component.html",
  styleUrls: ["./regions-rank.component.scss"],
})
export class RegionsRankComponent {
  @Input() regionsData!: RegionData[];
}
