import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Artist, ArtistWithSuggestion, Suggestion } from "../artists/artist.model";
import { CountryService } from "../country/country.service";
import { Country } from "../country/country.model";
import { TableRowSelectEvent } from "primeng/table";
import { DropdownChangeEvent } from "primeng/dropdown";

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

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig<Artist[]>,
    private dynamicDialogRef: DynamicDialogRef,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data) {
      this.artists = [...this.dynamicDialogConfig.data]
        .map((artist) => {
          (artist as ArtistWithSuggestion).suggestedCountry = undefined;
          return artist as ArtistWithSuggestion;
        })
        .sort((a: ArtistWithSuggestion, b: ArtistWithSuggestion) => {
          if (a.country && !b.country) return 1;
          if (!a.country && b.country) return -1;
          if (a.country && b.country) {
            if (a.country.name > b.country.name) return 1;
            else if (a.country.name < b.country.name) return -1;
          }
          return 0;
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
    const suggestions = this.artists
      .filter((artist) => artist.suggestedCountry)
      .map((artist) => {
        return {
          artist: artist,
          suggestedCountry: artist.suggestedCountry,
        } as Suggestion;
      });
    this.countryService.saveSuggestions(suggestions);
    this.dynamicDialogRef.close(true);
  }
}
