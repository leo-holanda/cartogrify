import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FourthPartComponent } from "./fourth-part.component";
import { ArtistsRankModule } from "src/app/artists/rankings/artists-rank/artists-rank.module";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { SuggestionsModule } from "src/app/artists/rankings/artists-rank/suggestions/suggestions.module";

@NgModule({
  declarations: [FourthPartComponent],
  imports: [CommonModule, ArtistsRankModule, ButtonModule, DialogModule, SuggestionsModule],
  exports: [FourthPartComponent],
})
export class FourthPartModule {}
