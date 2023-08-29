import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Artist } from "../artist.model";
import { CountryCount, RegionCount } from "../../country/country.model";
import { MenuItem } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { CountryService } from "../../country/country.service";
import { ArtistService } from "../artist.service";

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
  artists: Artist[] = [];
  @Input() countriesCount: CountryCount[] = [];
  @Input() regionsCount: RegionCount[] = [];
  @Input() isMobile!: boolean;
  @Input() shouldOpenRankings!: boolean;
  @Output() shouldHideRankings = new EventEmitter<boolean>();

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

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => (this.artists = artists));
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
