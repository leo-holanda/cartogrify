import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressBarModule } from "primeng/progressbar";
import { TabMenuModule } from "primeng/tabmenu";
import { RankingsComponent } from "./rankings.component";
import { MessagesModule } from "primeng/messages";
import { ButtonModule } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { SidebarModule } from "primeng/sidebar";
import { RegionsRankComponent } from "./regions-rank/regions-rank.component";
import { DialogModule } from "primeng/dialog";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ListboxModule } from "primeng/listbox";
import { FormsModule } from "@angular/forms";
import { RadioButtonModule } from "primeng/radiobutton";
import { CountriesRankModule } from "./countries-rank/countries-rank.module";
import { ArtistsRankModule } from "./artists-rank/artists-rank.module";

@NgModule({
  declarations: [RankingsComponent, RegionsRankComponent],
  imports: [
    CommonModule,
    ProgressBarModule,
    TabMenuModule,
    MessagesModule,
    ButtonModule,
    SidebarModule,
    DialogModule,
    OverlayPanelModule,
    ListboxModule,
    FormsModule,
    RadioButtonModule,
    CountriesRankModule,
    ArtistsRankModule,
  ],
  providers: [DialogService],
  exports: [RankingsComponent],
})
export class RankingsModule {}
