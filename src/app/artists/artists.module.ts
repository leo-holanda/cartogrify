import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsComponent } from "./artists.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { StreamingModule } from "../streaming/streaming.module";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { TabMenuModule } from "primeng/tabmenu";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { FormsModule } from "@angular/forms";
import { ProgressBarModule } from "primeng/progressbar";
import { DialogModule } from "primeng/dialog";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [
    CommonModule,
    ArtistsRoutingModule,
    StreamingModule,
    MessagesModule,
    ToastModule,
    ButtonModule,
    TabMenuModule,
    DynamicDialogModule,
    OverlayPanelModule,
    ListboxModule,
    RadioButtonModule,
    FormsModule,
    ProgressBarModule,
    DialogModule,
  ],
  providers: [DialogService],
})
export class ArtistsModule {}
