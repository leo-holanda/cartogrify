import { Component, OnInit } from "@angular/core";
import { Observable, switchMap, take } from "rxjs";
import { RegionService } from "src/app/region/region.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";

@Component({
  selector: "ctg-regions-stats",
  templateUrl: "./regions-stats.component.html",
  styleUrls: ["./regions-stats.component.scss"],
})
export class RegionsStatsComponent implements OnInit {
  comparedRegionDiversity!: Observable<ComparedDiversityData>;

  constructor(private statisticsService: StatisticsService, private regionService: RegionService) {}

  ngOnInit(): void {
    this.statisticsService.getRegionsDiversity().subscribe((regionsDiversity) => {
      console.log(regionsDiversity);
    });

    this.comparedRegionDiversity = this.regionService.getRegionsDiversity().pipe(
      take(1),
      switchMap((diversityData) => {
        return this.statisticsService.getComparedRegionsDiversity(diversityData.regions);
      })
    );
  }
}
