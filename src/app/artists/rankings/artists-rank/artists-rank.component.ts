import { Component, Input } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Artist } from "src/app/artists/artist.model";
import { SuggestionsComponent } from "./suggestions/suggestions.component";

@Component({
  selector: "ctg-artists-rank",
  templateUrl: "./artists-rank.component.html",
  styleUrls: ["./artists-rank.component.scss"],
})
export class ArtistsRankComponent {
  @Input() artists!: Artist[];

  isMessageActive = true;
  ref: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService) {}

  hideMessage(): void {
    this.isMessageActive = false;
  }

  openDialog() {
    this.ref = this.dialogService.open(SuggestionsComponent, {
      header: "Make your suggestions!",
      data: this.artists,
    });

    //FIX LOGIC
    // this.ref.onClose.subscribe((hasSuggestions) => {
    //   if (hasSuggestions) {
    //     this.countriesCount = this.countryService.countCountries(this.artists);
    //     this.regionsCount = this.countryService.countRegions(this.artists);
    //   }
    // });
  }
}
