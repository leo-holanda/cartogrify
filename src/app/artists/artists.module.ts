import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsComponent } from "./artists.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { StreamingModule } from "../streaming/streaming.module";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";
import { TabViewModule } from "primeng/tabview";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [
    CommonModule,
    ArtistsRoutingModule,
    StreamingModule,
    MessagesModule,
    ToastModule,
    ButtonModule,
    TabViewModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],
})
export class ArtistsModule {}
