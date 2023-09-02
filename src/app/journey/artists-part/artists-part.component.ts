import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "ctg-artists-part",
  templateUrl: "./artists-part.component.html",
  styleUrls: ["./artists-part.component.scss"],
})
export class ArtistsPartComponent {
  shouldMakeSuggestions$ = new Subject<boolean>();
  shouldOpenDialog = false;
  hasHappyNoises = false;

  constructor() {}

  openSuggestionDialog(): void {
    this.shouldOpenDialog = true;
  }

  onCancelButtonClick(): void {
    this.shouldMakeSuggestions$.next(false);
  }

  onSuggestButtonClick(): void {
    this.shouldMakeSuggestions$.next(true);
    this.hasHappyNoises = true;
  }

  closeSuggestionDialog(): void {
    this.shouldOpenDialog = false;
  }
}
