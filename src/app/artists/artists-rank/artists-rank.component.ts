import { Component, OnInit } from "@angular/core";
import { Artist, ArtistsSources } from "src/app/artists/artist.model";
import { Subject } from "rxjs";
import { ArtistService } from "../artist.service";

@Component({
  selector: "ctg-artists-rank",
  templateUrl: "./artists-rank.component.html",
  styleUrls: ["./artists-rank.component.scss"],
})
export class ArtistsRankComponent implements OnInit {
  artists: Artist[] = [];
  userArtistsSource!: ArtistsSources;

  shouldMakeSuggestions$ = new Subject<boolean>();
  isMessageActive = true;
  shouldOpenDialog = false;

  artistsSources = ArtistsSources;

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.getUserTopArtists().subscribe((artists) => {
      this.userArtistsSource = this.artistService.getSource();
      this.artists = artists;
    });
  }

  hideMessage(): void {
    this.isMessageActive = false;
  }

  openDialog() {
    this.shouldOpenDialog = true;
  }

  onCancelButtonClick(): void {
    this.shouldMakeSuggestions$.next(false);
  }

  onSuggestButtonClick(): void {
    this.shouldMakeSuggestions$.next(true);

    //TODO Implement changing regions and countries count
  }

  onShouldCloseDialog(): void {
    this.shouldOpenDialog = false;
  }
}
