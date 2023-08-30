import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Artist } from "../artist.model";
import { CountryCount, RegionCount } from "../../country/country.model";
import { MenuItem } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { CountryService } from "../../country/country.service";
import { ArtistService } from "../artist.service";
import { StatisticsService } from "src/app/statistics/statistics.service";
import { ComparedDiversityData } from "src/app/statistics/statistics.model";

enum DataTypes {
  COUNTRIES = "Countries",
  REGIONS = "Regions",
  ARTISTS = "Artists",
}

@Component({
  selector: "ctg-rankings",
  templateUrl: "./rankings.component.html",
  styleUrls: ["./rankings.component.scss"],
})
export class RankingsComponent implements OnInit {
  @Input() isMobile!: boolean;
  @Input() shouldOpenRankings!: boolean;
  @Output() shouldHideRankings = new EventEmitter<boolean>();

  artists: Artist[] = [];
  countriesCount: CountryCount[] = [];
  regionsCount: RegionCount[] = [];

  comparedDiversity!: ComparedDiversityData;

  selectedData = DataTypes.COUNTRIES;
  activeItem = DataTypes.COUNTRIES;
  items: MenuItem[] = [
    {
      label: DataTypes.COUNTRIES,
      icon: "bx bxs-flag-alt",
    },
    {
      label: DataTypes.REGIONS,
      icon: "bx bx-world",
    },
    {
      label: DataTypes.ARTISTS,
      icon: "bx bxs-music",
    },
  ];

  DataTypes = DataTypes;
  sidebarVisible = false;

  constructor(
    private artistService: ArtistService,
    private countryService: CountryService,
    private statisticService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => (this.artists = artists));

    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;

      this.statisticService
        .getComparedDiversity(this.countriesCount.length)
        .subscribe((comparedDiversity) => {
          this.comparedDiversity = comparedDiversity;
        });
    });

    this.countryService.getRegionsCount().subscribe((regionsCount) => {
      this.regionsCount = regionsCount;
    });
  }

  onActiveItemChange(activeItem: MenuItem): void {
    this.activeItem = activeItem.label as DataTypes;
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  hideRankings(): void {
    this.shouldHideRankings.emit(true);
  }
}
