import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Artist } from "../artist.model";
import { CountryCount, RegionCount } from "../../country/country.model";
import { MenuItem } from "primeng/api";
import { CountryService } from "../../country/country.service";
import { ArtistService } from "../artist.service";
import { StatisticsService } from "src/app/statistics/statistics.service";
import {
  ComparedDiversityData,
  ComparedDiversityInUserCountryData,
} from "src/app/statistics/statistics.model";
import { ThemeService } from "src/app/core/theme.service";
import { MapTheme, mapThemes } from "../world-map/world-map.themes";
import { ListboxClickEvent } from "primeng/listbox";
import { RadioButtonClickEvent } from "primeng/radiobutton";
import { UserService } from "src/app/user/user.service";

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
  mapBackgroundColor = "";

  comparedDiversity!: ComparedDiversityData;
  comparedDiversityInUserCountry!: ComparedDiversityInUserCountryData;

  mapThemes = mapThemes;
  mapTheme = mapThemes[0];

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
    private statisticService: StatisticsService,
    private themeService: ThemeService,
    private userService: UserService
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

    this.themeService.getMapTheme().subscribe((mapTheme) => {
      this.mapTheme = mapTheme;
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

  onMapThemeSelect(event: ListboxClickEvent): void {
    this.themeService.setMapTheme(event.option);
  }

  onMapBackgroundColorSelect(event: RadioButtonClickEvent): void {
    this.themeService.setMapThemeBackground(event.value);
  }
}
