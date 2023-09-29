import { Component, OnInit } from "@angular/core";
import { SelectItem } from "primeng/api";
import { SelectButtonOptionClickEvent } from "primeng/selectbutton";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";

@Component({
  selector: "ctg-geographic-stats",
  templateUrl: "./geographic-stats.component.html",
  styleUrls: ["./geographic-stats.component.scss"],
})
export class GeographicStatsComponent implements OnInit {
  userArtistsSource!: ArtistsSources;
  artistsSource = ArtistsSources;

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.userArtistsSource = this.artistService.getSource();
  }

  chartOptions: SelectItem[] = [
    {
      label: "Continents",
      value: "continents",
    },
    {
      label: "Regions",
      value: "regions",
    },
  ];

  chartToShow = this.chartOptions[0].label;

  onSelect(event: SelectButtonOptionClickEvent): void {
    this.chartToShow = event.option.label;
  }
}
