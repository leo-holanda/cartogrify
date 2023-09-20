import { Component, OnInit } from "@angular/core";
import { Subject, fromEvent } from "rxjs";

@Component({
  selector: "ctg-artists-part",
  templateUrl: "./artists-part.component.html",
  styleUrls: ["./artists-part.component.scss"],
})
export class ArtistsPartComponent implements OnInit {
  shouldMakeSuggestions$ = new Subject<boolean>();
  shouldOpenDialog = false;
  hasHappyNoises = false;
  isMobile = window.innerWidth <= 1280;

  ngOnInit(): void {
    fromEvent(window, "resize")
      .pipe()
      .subscribe(() => {
        this.isMobile = window.innerWidth <= 1280;
      });
  }

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
