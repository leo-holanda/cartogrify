import { Component, Input, OnInit } from "@angular/core";
import { Artist } from "src/app/artists/artist.model";
import { CountryCount } from "src/app/country/country.model";
import { ArtistService } from "../../artist.service";

@Component({
  selector: "ctg-countries-rank",
  templateUrl: "./countries-rank.component.html",
  styleUrls: ["./countries-rank.component.scss"],
})
export class CountriesRankComponent implements OnInit {
  @Input() countriesCount!: CountryCount[];
  artists: Artist[] = [];

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => (this.artists = artists));
  }
}
