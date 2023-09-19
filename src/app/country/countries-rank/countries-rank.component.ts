import { Component, OnInit } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryCount } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import { ThemeService } from "src/app/core/theme.service";
import { ArtistService } from "src/app/artists/artist.service";
import { MapTheme } from "src/app/artists/world-map/world-map.themes";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent implements OnInit {
  artists: Artist[] = [];
  countriesCount: CountryCount[] = [];
  mapTheme!: MapTheme;

  constructor(
    private artistService: ArtistService,
    private countryService: CountryService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => {
      this.artists = artists;
    });

    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });

    this.themeService.getMapTheme().subscribe((mapTheme) => {
      this.mapTheme = mapTheme;
    });
  }
}
