import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsRankComponent } from "./artists-rank.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { MessagesModule } from "primeng/messages";
import { SuggestionsModule } from "./suggestions/suggestions.module";

@NgModule({
  declarations: [ArtistsRankComponent],
  imports: [CommonModule, ButtonModule, DialogModule, MessagesModule, SuggestionsModule],
  exports: [ArtistsRankComponent],
})
export class ArtistsRankModule {}
