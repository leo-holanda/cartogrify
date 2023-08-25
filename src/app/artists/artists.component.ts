import { Component, OnInit } from "@angular/core";
import { debounceTime, filter, fromEvent } from "rxjs";
import { Artist } from "./artist.model";
import { ArtistService } from "./artist.service";
import { CountryData, RegionData } from "../country/country.model";
import { CountryService } from "../country/country.service";
import { Message } from "primeng/api";

@Component({
  selector: "msm-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"],
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  countriesData: CountryData[] = [];
  regionsData: RegionData[] = [];

  isMobile = window.innerWidth <= 768;
  messages: Message[] = [];
  shouldOpenRankings = false;

  constructor(private artistsService: ArtistService, private countryService: CountryService) {}

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

  openRankings(): void {
    this.shouldOpenRankings = true;
  }

  hideRankings(): void {
    this.shouldOpenRankings = false;
  }
}
