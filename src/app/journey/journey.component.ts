import { Component, OnInit } from "@angular/core";
import { ArtistService } from "../artists/artist.service";
import { CountryService } from "../country/country.service";
import { RegionService } from "../region/region.service";

@Component({
  selector: "ctg-journey",
  templateUrl: "./journey.component.html",
  styleUrls: ["./journey.component.scss"],
})
export class JourneyComponent implements OnInit {
  constructor(
    private artistService: ArtistService,
    private countryService: CountryService,
    private regionService: RegionService
  ) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((userTopArtists) => {
      this.countryService.updateCountriesCount(userTopArtists);
      this.regionService.updateRegionsCount(userTopArtists);
    });
  }
}
