import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DropdownChangeEvent } from "primeng/dropdown";
import { ArtistWithSuggestion, Artist } from "src/app/artists/artist.model";
import { Country } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import { Subject, debounceTime, fromEvent } from "rxjs";
import { ArtistService } from "src/app/artists/artist.service";

@Component({
  selector: "ctg-suggestions",
  templateUrl: "./suggestions.component.html",
  styleUrls: ["./suggestions.component.scss"],
})
export class SuggestionsComponent implements OnInit {
  artists: Artist[] = [];
  @Input() shouldMakeSuggestions$!: Subject<boolean>;
  @Output() shouldCloseDialog = new EventEmitter<boolean>();

  artistsWithSuggestion: ArtistWithSuggestion[] = [];
  countries: Country[] = [];
  selectedCountryToBulkSuggest: Country | undefined;
  selectedArtistsToBulkSuggest: ArtistWithSuggestion[] = [];

  isMobile = window.innerWidth <= 768;

  constructor(private countryService: CountryService, private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => {
      this.artists = artists;
    });

    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 768;
      });

    this.shouldMakeSuggestions$.subscribe((shouldMakeSuggestions) => {
      if (shouldMakeSuggestions) {
        const suggestions = this.artistsWithSuggestion.filter((artist) => artist.suggestedCountry);
        suggestions.forEach((suggestion) => {
          const matchedArtist = this.artists.find((artist) => suggestion.name == artist.name);
          if (matchedArtist) matchedArtist.country = suggestion.suggestedCountry;
        });

        this.countryService.saveSuggestions(
          suggestions.map((suggestion) => {
            return {
              name: suggestion.name,
              country: suggestion.suggestedCountry,
              secondaryLocation: undefined,
            };
          })
        );
      }

      this.shouldCloseDialog.emit(true);
    });

    this.artistsWithSuggestion = [...this.artists].map((artist) => {
      return { ...artist, suggestedCountry: undefined } as ArtistWithSuggestion;
    });

    this.countries = this.countryService.geoJSON.features
      .map((feature) => this.countryService.createCountryFromFeature(feature))
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  onBulkSuggestDropdownChange(event: DropdownChangeEvent): void {
    this.selectedArtistsToBulkSuggest.forEach((artist) => (artist.suggestedCountry = event.value));
  }
}
