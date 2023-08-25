import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressBarModule } from "primeng/progressbar";
import { TabMenuModule } from "primeng/tabmenu";
import { RankingsComponent } from "./rankings.component";
import { MessagesModule } from "primeng/messages";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { SidebarModule } from "primeng/sidebar";
import { CountriesRankComponent } from "./countries-rank/countries-rank.component";
import { RegionsRankComponent } from "./regions-rank/regions-rank.component";
import { ArtistsRankComponent } from "./artists-rank/artists-rank.component";
import { SuggestionsModule } from "./artists-rank/suggestions/suggestions.module";

@NgModule({
  declarations: [
    RankingsComponent,
    CountriesRankComponent,
    RegionsRankComponent,
    ArtistsRankComponent,
  ],
  imports: [
    CommonModule,
    ProgressBarModule,
    TabMenuModule,
    MessagesModule,
    ButtonModule,
    DynamicDialogModule,
    SidebarModule,
    SuggestionsModule,
  ],
  providers: [DialogService],
  exports: [RankingsComponent],
})
export class RankingsModule {}
