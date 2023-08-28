import { Component, Input } from "@angular/core";
import { RegionCount } from "src/app/country/country.model";

@Component({
  selector: "ctg-regions-rank",
  templateUrl: "./regions-rank.component.html",
  styleUrls: ["./regions-rank.component.scss"],
})
export class RegionsRankComponent {
  @Input() regionsCount!: RegionCount[];
}
