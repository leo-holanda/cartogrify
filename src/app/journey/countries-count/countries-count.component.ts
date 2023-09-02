import { Component, OnInit } from "@angular/core";
import { CountryCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-countries-count",
  templateUrl: "./countries-count.component.html",
  styleUrls: ["./countries-count.component.scss"],
})
export class CountriesCountComponent implements OnInit {
  countriesCount: CountryCount[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });
  }
}
