import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs";
import { Artist } from "./artist.model";
import { ArtistService } from "./artist.service";
import { CountryData, RegionData } from "../country/country.model";
import { CountryService } from "../country/country.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { MenuItem } from "primeng/api";

enum DataTypes {
  COUNTRIES = "Countries",
  REGIONS = "Regions",
  ARTISTS = "Artists",
}

@Component({
  selector: "msm-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"],
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  countriesData: CountryData[] = [];
  regionsData: RegionData[] = [];
  selectedData = DataTypes.COUNTRIES;
  isMessageActive = true;

  activeItem = DataTypes.COUNTRIES;
  items: MenuItem[] = [
    {
      label: DataTypes.COUNTRIES,
      icon: "pi pi-flag-fill",
    },
    {
      label: DataTypes.REGIONS,
      icon: "pi pi-map",
    },
    {
      label: DataTypes.ARTISTS,
      icon: "pi pi-user",
    },
  ];

  ref: DynamicDialogRef | undefined;
  DataTypes = DataTypes;

  constructor(
    private artistsService: ArtistService,
    private countryService: CountryService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = [...this.countryService.countCountries(userTopArtists)];
        this.regionsData = this.countryService.countRegions(userTopArtists);
      });
  }

  setSelectedData(dataType: DataTypes): void {
    this.selectedData = dataType;
  }

  hideMessage(): void {
    this.isMessageActive = false;
  }

  openDialog() {
    this.ref = this.dialogService.open(SuggestionsComponent, {
      header: "Make your suggestions!",
      data: this.artists,
    });

    this.ref.onClose.subscribe((hasSuggestions) => {
      if (hasSuggestions) {
        this.countriesData = this.countryService.countCountries(this.artists);
        this.regionsData = this.countryService.countRegions(this.artists);
      }
    });
  }

  onActiveItemChange(activeItem: MenuItem): void {
    this.activeItem = activeItem.label as DataTypes;
  }
}
