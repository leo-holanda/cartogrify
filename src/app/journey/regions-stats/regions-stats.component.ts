import { Component, OnInit } from "@angular/core";
import { Observable, switchMap, take } from "rxjs";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";
import { Country } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import { RegionService } from "src/app/region/region.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "ctg-regions-stats",
  templateUrl: "./regions-stats.component.html",
  styleUrls: ["./regions-stats.component.scss"],
})
export class RegionsStatsComponent implements OnInit {
  comparedRegionDiversity!: Observable<ComparedDiversityData>;
  comparedRegionDiversityInUserCountry!: Observable<ComparedDiversityData>;

  userCountry!: Country;
  userArtistsSource!: ArtistsSources;

  constructor(
    private statisticsService: StatisticsService,
    private regionService: RegionService,
    private userService: UserService,
    private countryService: CountryService,
    private artistService: ArtistService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    this.userCountry = this.countryService.getCountryByCode(user?.countryCode);
    this.userArtistsSource = this.artistService.getSource();

    this.statisticsService.getRegionsDiversity().subscribe((regionsDiversity) => {
      console.log(regionsDiversity);
    });

    this.comparedRegionDiversity = this.regionService.getRegionsDiversity().pipe(
      take(1),
      switchMap((diversityData) => {
        return this.statisticsService.getComparedRegionsDiversity(diversityData.regions);
      })
    );

    if (this.userCountry.NE_ID != -1) {
      this.comparedRegionDiversityInUserCountry = this.regionService.getRegionsDiversity().pipe(
        take(1),
        switchMap((diversityData) => {
          return this.statisticsService.getComparedRegionsDiversity(
            diversityData.regions,
            this.userCountry.NE_ID
          );
        })
      );
    }
  }
}
