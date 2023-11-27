import { Component, OnInit } from "@angular/core";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";
import { CountryCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-countries-count",
  templateUrl: "./countries-count.component.html",
  styleUrls: ["./countries-count.component.scss"],
})
export class CountriesCountComponent implements OnInit {
  countriesCount: CountryCount[] = [];
  source!: ArtistsSources;

  artistsSources = ArtistsSources;

  constructor(private countryService: CountryService, private artistService: ArtistService) {}

  ngOnInit(): void {
    this.source = this.artistService.getSource();
    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });
  }
}
