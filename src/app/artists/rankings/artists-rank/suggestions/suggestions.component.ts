import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DropdownChangeEvent } from "primeng/dropdown";
import { ArtistWithSuggestion, Artist } from "src/app/artists/artist.model";
import { Country } from "src/app/country/country.model";
import { CountryService } from "src/app/country/country.service";
import { debounceTime, fromEvent } from "rxjs";

@Component({
  selector: "app-suggestions",
  templateUrl: "./suggestions.component.html",
  styleUrls: ["./suggestions.component.scss"],
})
export class SuggestionsComponent implements OnInit {
  artists: ArtistWithSuggestion[] = [];
  countries: Country[] = [];
  selectedCountryToBulkSuggest: Country | undefined;
  selectedArtistsToBulkSuggest: ArtistWithSuggestion[] = [];
  isMobile = window.innerWidth <= 768;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig<Artist[]>,
    private dynamicDialogRef: DynamicDialogRef,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    fromEvent(window, "resize")
      .pipe(debounceTime(250))
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 768;
      });

    if (this.dynamicDialogConfig.data) {
      this.artists = [...this.dynamicDialogConfig.data].map((artist) => {
        (artist as ArtistWithSuggestion).suggestedCountry = undefined;
        return artist as ArtistWithSuggestion;
      });

      this.countries = this.countryService.geoJSON.features.map((feature) =>
        this.countryService.createCountryFromFeature(feature)
      );
    }
  }

  onBulkSuggestDropdownChange(event: DropdownChangeEvent): void {
    this.selectedArtistsToBulkSuggest.forEach((artist) => (artist.suggestedCountry = event.value));
  }

  onCancelButtonClick(): void {
    this.dynamicDialogRef.close(false);
  }

  onConfirmButtonClick(): void {
    const suggestions = this.artists.filter((artist) => artist.suggestedCountry);
    suggestions.forEach((artist) => (artist.country = artist.suggestedCountry));

    this.countryService.saveSuggestions(
      suggestions.map((suggestion) => {
        return {
          name: suggestion.name,
          country: suggestion.suggestedCountry,
        };
      })
    );
    this.dynamicDialogRef.close(true);
  }
}
