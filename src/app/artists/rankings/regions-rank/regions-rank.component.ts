import { Component, OnInit } from "@angular/core";
import { RegionCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-regions-rank",
  templateUrl: "./regions-rank.component.html",
  styleUrls: ["./regions-rank.component.scss"],
})
export class RegionsRankComponent implements OnInit {
  regionsCount: RegionCount[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getRegionsCount().subscribe((regionsCount) => {
      this.regionsCount = regionsCount;
    });
  }
}
