import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { TabMenuModule } from "primeng/tabmenu";
import { ProgressBarModule } from "primeng/progressbar";
import { DialogModule } from "primeng/dialog";
import { WorldMapModule } from "./world-map/world-map.module";
import { RankingsModule } from "./rankings/rankings.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagesModule,
    ToastModule,
    ButtonModule,
    TabMenuModule,
    DynamicDialogModule,
    ProgressBarModule,
    DialogModule,
    WorldMapModule,
    RankingsModule,
  ],
  providers: [DialogService],
})
export class ArtistsModule {}
