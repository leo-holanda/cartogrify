import { Component } from "@angular/core";
import { ArtistService } from "../artists/artist.service";
import { CountryService } from "../country/country.service";

@Component({
  selector: "ctg-journey",
  templateUrl: "./journey.component.html",
  styleUrls: ["./journey.component.scss"],
})
export class JourneyComponent {
  constructor(private artistService: ArtistService, private countryService: CountryService) {}
}
