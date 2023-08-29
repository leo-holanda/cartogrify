import { Component, OnInit } from "@angular/core";
import { debounceTime, filter, fromEvent } from "rxjs";
import { Artist, ScrapedArtistData } from "./artist.model";
import { ArtistService } from "./artist.service";
import { CountryCount, RegionCount } from "../country/country.model";
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

  isMobile = window.innerWidth <= 768;
  messages: Message[] = [];
  shouldOpenRankings = false;

  constructor(private artistsService: ArtistService, private countryService: CountryService) {}

  ngOnInit(): void {
    this.sendInitialMessages();

    this.artistsService.getUserTopArtists().subscribe((userTopArtists) => {
      this.artists = userTopArtists;
    });

    this.countryService.getCountriesCount().subscribe((countriesCount) => {
      this.countriesCount = countriesCount;
    });

    this.countryService.getRegionsCount().subscribe((regionsCount) => {
      this.regionsCount = regionsCount;
    });

    this.artistsService
      .hasArtistsWithoutCountryStatus()
      .pipe(
        filter(
          (hasArtistsWithoutCountry): hasArtistsWithoutCountry is boolean =>
            hasArtistsWithoutCountry !== undefined
        )
      )
      .subscribe((hasArtistsWithoutCountry) => {
        if (hasArtistsWithoutCountry) {
          this.messages = [
            ...this.messages,
            {
              severity: "info",
              detail:
                "Our super-fancy AI doesn't know some artists you listen to. It will try to know where they come from!",
            },
          ];
        } else {
          this.messages = [
            ...this.messages,
            {
              severity: "info",
              detail:
                "That's it! Your top artists are now loaded. If you noticed something wrong, please suggest correct countries at the artist tab in the results.",
            },
          ];

          this.clearMessages();
        }
      });

    this.artistsService
      .getScrapedArtists()
      .pipe(
        filter(
          (scrapedArtistData): scrapedArtistData is ScrapedArtistData =>
            scrapedArtistData !== undefined
        )
      )
      .subscribe({
        next: (scrapedArtistData) => {
          const scrapedArtistMessage = this.buildScrapedArtistMessage(scrapedArtistData);
          this.emitMessage(scrapedArtistMessage);
          if (this.isFinalMessage(scrapedArtistData)) this.emitFinalMessage();
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

  private sendInitialMessages(): void {
    if (this.isMobile) {
      this.messages = [
        {
          severity: "info",
          detail: "For a larger view, consider zooming in or rotating your device!",
          life: 10000,
        } as Message,
      ];
    }

    this.messages = [
      ...this.messages,
      {
        severity: "info",
        detail: "Searching for your top artists...",
      },
    ];
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.messages = [];
    }, 8000);
  }

  private buildScrapedArtistMessage(scrapedArtistData: ScrapedArtistData): Message {
    let messageDetail;
    if (scrapedArtistData.artist.country)
      messageDetail = `${scrapedArtistData.artist.name} comes from ${scrapedArtistData.artist.country.name} (${scrapedArtistData.remanining}/${scrapedArtistData.total})`;
    else
      messageDetail = `I couldn't find where ${scrapedArtistData.artist.name} comes from! (${scrapedArtistData.remanining}/${scrapedArtistData.total})`;

    return {
      severity: scrapedArtistData.artist.country ? "success" : "warn",
      detail: messageDetail,
      key: "map-messages",
    } as Message;
  }

  private emitMessage(message: Message): void {
    if (this.messages.length > 1) this.messages.splice(0, Math.abs(1 - this.messages.length));
    this.messages = [...this.messages, message];
  }

  private isFinalMessage(scrapedArtistData: ScrapedArtistData): boolean {
    return scrapedArtistData.remanining == scrapedArtistData.total;
  }

  private emitFinalMessage(): void {
    setTimeout(() => {
      if (this.messages.length > 1) this.messages.splice(0, 1);
      this.messages = [
        ...this.messages,
        {
          severity: "success",
          detail:
            "That's it! If you noticed something wrong, please suggest correct countries at the artist tab in the results.",
        },
      ];

      this.clearMessages();
    }, 1000);
  }
}
