import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "src/app/statistics/statistics.service";

@Component({
  selector: "ctg-regions-stats",
  templateUrl: "./regions-stats.component.html",
  styleUrls: ["./regions-stats.component.scss"],
})
export class RegionsStatsComponent implements OnInit {
  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.statisticsService.getRegionsDiversity().subscribe((regionsDiversity) => {
      console.log(regionsDiversity);
    });
  }
}
