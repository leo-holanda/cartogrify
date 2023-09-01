import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "ctg-fourth-part",
  templateUrl: "./fourth-part.component.html",
  styleUrls: ["./fourth-part.component.scss"],
})
export class FourthPartComponent {
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
