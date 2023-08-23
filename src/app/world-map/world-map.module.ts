import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TabMenuModule } from "primeng/tabmenu";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { WorldMapComponent } from "./world-map.component";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { ToggleButtonModule } from "primeng/togglebutton";
import { MessagesModule } from "primeng/messages";

@NgModule({
  declarations: [WorldMapComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    OverlayPanelModule,
    ListboxModule,
    RadioButtonModule,
    FormsModule,
    DialogModule,
    CardModule,
    TagModule,
    ToggleButtonModule,
    MessagesModule,
  ],
  exports: [WorldMapComponent],
})
export class WorldMapModule {}
