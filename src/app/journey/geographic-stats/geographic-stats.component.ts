import { Component, OnInit } from "@angular/core";
import { SelectItem } from "primeng/api";
import { SelectButtonOptionClickEvent } from "primeng/selectbutton";

@Component({
  selector: "ctg-geographic-stats",
  templateUrl: "./geographic-stats.component.html",
  styleUrls: ["./geographic-stats.component.scss"],
})
export class GeographicStatsComponent {
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
