import { Component, OnInit } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryCount } from "src/app/country/country.model";
import { ArtistService } from "../../artist.service";
import { CountryService } from "src/app/country/country.service";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent implements OnInit {
  artists: Artist[] = [];
  countriesCount: CountryCount[] = [];

  constructor(private artistService: ArtistService, private countryService: CountryService) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => {
      this.artists = artists;
    });

    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });
  }
}
