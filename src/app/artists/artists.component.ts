import { Component, OnInit } from "@angular/core";
import { debounceTime, filter, fromEvent } from "rxjs";
import { Artist, ScrapedArtistData } from "./artist.model";
import { ArtistService } from "./artist.service";
import { CountryCount, DiversityStatistics, RegionCount } from "../country/country.model";
import { CountryService } from "../country/country.service";
import { Message } from "primeng/api";

@Component({
  selector: "msm-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"],
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  countriesCount: CountryCount[] = [];
  regionsCount: RegionCount[] = [];
  diversityStatistics!: DiversityStatistics;

  isMobile = window.innerWidth <= 768;
  messages: Message[] = [];
  shouldOpenRankings = false;

  constructor(private artistsService: ArtistService, private countryService: CountryService) {}

  ngOnInit(): void {
    if (this.isMobile) {
      this.messages = [
        {
          severity: "info",
          detail: "For a larger view, consider zooming in or rotating your device!",
          life: 10000,
        } as Message,
      ];
    }

    this.countryService
      .getDiversityStatistics()
      .subscribe((diversityStatistics) => (this.diversityStatistics = diversityStatistics));

    this.artistsService
      .getUserTopArtists()
      .pipe(filter((userTopArtists): userTopArtists is Artist[] => userTopArtists !== undefined))
      .subscribe((userTopArtists) => {
        this.artists = userTopArtists;
        this.countriesCount = [...this.countryService.countCountries(userTopArtists)];
        this.regionsCount = this.countryService.countRegions(userTopArtists);
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
      .pipe(
        filter(
          (scrappedArtistData): scrappedArtistData is ScrapedArtistData =>
            scrappedArtistData !== undefined
        )
      )
      .subscribe({
        next: (scrappedArtistData) => {
          let messageDetail;
          if (scrappedArtistData.artist.country)
            messageDetail = `${scrappedArtistData.artist.name} comes from ${scrappedArtistData.artist.country.name} (${scrappedArtistData.remanining}/${scrappedArtistData.total})`;
          else
            messageDetail = `I couldn't find where ${scrappedArtistData.artist.name} comes from! (${scrappedArtistData.remanining}/${scrappedArtistData.total})`;

          if (this.messages.length > 1) this.messages.splice(0, 1);
          this.messages = [
            ...this.messages,
            {
              severity: scrappedArtistData.artist.country ? "success" : "warn",
              detail: messageDetail,
              key: "map-messages",
            } as Message,
          ];
        },
        complete: () => {
          if (this.messages.length > 1) this.messages.splice(0, 1);
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
          }, 8000);
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
