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
  ],
  exports: [WorldMapComponent],
})
export class WorldMapModule {}
