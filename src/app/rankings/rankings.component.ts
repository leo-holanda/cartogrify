import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Artist } from "../artists/artist.model";
import { CountryData, RegionData } from "../country/country.model";
import { MenuItem } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { CountryService } from "../country/country.service";

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
export class RankingsComponent {
  @Input() artists: Artist[] = [];
  @Input() countriesData: CountryData[] = [];
  @Input() regionsData: RegionData[] = [];
  @Input() isMobile!: boolean;
  @Input() shouldOpenRankings!: boolean;
  @Output() shouldHideRankings = new EventEmitter<boolean>();

  selectedData = DataTypes.COUNTRIES;
  activeItem = DataTypes.COUNTRIES;
  items: MenuItem[] = [
    {
      label: DataTypes.COUNTRIES,
      icon: "pi pi-flag",
    },
    {
      label: DataTypes.REGIONS,
      icon: "pi pi-globe",
    },
    {
      label: DataTypes.ARTISTS,
      icon: "pi pi-user",
    },
  ];

  DataTypes = DataTypes;
  sidebarVisible = false;

  constructor(private dialogService: DialogService, private countryService: CountryService) {}

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
