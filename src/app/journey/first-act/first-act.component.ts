import { Component, OnInit } from "@angular/core";
import { CountryCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-first-act",
  templateUrl: "./first-act.component.html",
  styleUrls: ["./first-act.component.scss"],
})
export class FirstActComponent implements OnInit {
  countriesCount: CountryCount[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });
  }
}
