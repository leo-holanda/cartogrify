import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsPartComponent } from "./artists-part.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ArtistsRankModule } from "src/app/artists/artists-rank/artists-rank.module";
import { SuggestionsModule } from "src/app/artists/suggestions/suggestions.module";

@NgModule({
  declarations: [ArtistsPartComponent],
  imports: [CommonModule, ArtistsRankModule, ButtonModule, DialogModule, SuggestionsModule],
  exports: [ArtistsPartComponent],
})
export class ArtistsPartModule {}
