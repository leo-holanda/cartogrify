import { Component, OnInit } from "@angular/core";
import { ArtistService } from "../artists/artist.service";
import { ArtistsSources } from "../artists/artist.model";

@Component({
  selector: "ctg-journey",
  templateUrl: "./journey.component.html",
  styleUrls: ["./journey.component.scss"],
})
export class JourneyComponent implements OnInit {
  artistSource!: ArtistsSources;
  artistsSources = ArtistsSources;

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistSource = this.artistService.getSource();
  }
}
