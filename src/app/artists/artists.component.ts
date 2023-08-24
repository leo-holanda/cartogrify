import { Component, OnInit } from "@angular/core";
import { debounceTime, filter, first, fromEvent } from "rxjs";
import { Artist } from "./artist.model";
import { ArtistService } from "./artist.service";
import { CountryData, RegionData } from "../country/country.model";
import { CountryService } from "../country/country.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { MenuItem, Message } from "primeng/api";

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

  ref: DynamicDialogRef | undefined;
  DataTypes = DataTypes;
  isMobile = window.innerWidth <= 768;
  sidebarVisible = false;

  messages: Message[] = [];

  constructor(
    private artistsService: ArtistService,
    private countryService: CountryService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.isMobile) {
      this.messages = [
        {
          severity: "info",
          detail:
            "The map might seem small when displayed on a mobile screen due to the projection. For a larger view, consider zooming in or rotating your phone!",
          life: 10000,
        } as Message,
      ];
    }

    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesData = [...this.countryService.countCountries(userTopArtists)];
        this.regionsData = this.countryService.countRegions(userTopArtists);
      });

    this.artistsService
      .getArtistsWithoutCountryStatus()
      .pipe(filter((status): status is boolean => status !== undefined))
      .subscribe((status) => {
        if (status) {
          this.messages = [
            ...this.messages,
            {
              severity: "info",
              detail:
                "Our super-fancy AI doesn't know some artists you listen to. It will try to know where they come from!",
            },
          ];
        }
      });

    this.artistsService
      .getScrappedArtists()
      .pipe(filter((scrappedArtist): scrappedArtist is Artist => scrappedArtist !== undefined))
      .subscribe({
        next: (scrappedArtist) => {
          let messageDetail;
          if (scrappedArtist.country)
            messageDetail = `${scrappedArtist.name} comes from ${scrappedArtist.country.name}`;
          else messageDetail = `I couldn't find where ${scrappedArtist.name} comes from!`;

          if (this.messages.length > 1) this.messages.splice(0, 1);
          this.messages = [
            ...this.messages,
            {
              severity: scrappedArtist.country ? "success" : "warn",
              detail: messageDetail,
              key: "map-messages",
            } as Message,
          ];
        },
        complete: () => {
          this.messages = [
            ...this.messages,
            {
              severity: "success",
              detail:
                "That's it! If you noticed something wrong, please suggest correct countries at the artist tab in the rankings.",
            },
          ];
          setTimeout(() => {
            this.messages = [];
          }, 5000);
        },
      });

    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 768;
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

  openRankings(): void {
    this.sidebarVisible = true;
  }
}
