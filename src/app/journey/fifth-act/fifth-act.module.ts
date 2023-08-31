import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FifthActComponent } from "./fifth-act.component";
import { WorldMapModule } from "src/app/artists/world-map/world-map.module";

@NgModule({
  declarations: [FifthActComponent],
  imports: [CommonModule, WorldMapModule],
  exports: [FifthActComponent],
})
export class FifthActModule {}
