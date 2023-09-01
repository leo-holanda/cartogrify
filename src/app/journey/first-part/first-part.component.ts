import { Component, OnInit } from "@angular/core";
import { CountryCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-first-part",
  templateUrl: "./first-part.component.html",
  styleUrls: ["./first-part.component.scss"],
})
export class FirstPartComponent implements OnInit {
  countriesCount: CountryCount[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });
  }
}
