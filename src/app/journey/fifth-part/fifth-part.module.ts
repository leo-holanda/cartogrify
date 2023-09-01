import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FifthPartComponent } from "./fifth-part.component";
import { WorldMapModule } from "src/app/artists/world-map/world-map.module";

@NgModule({
  declarations: [FifthPartComponent],
  imports: [CommonModule, WorldMapModule],
  exports: [FifthPartComponent],
})
export class FifthPartModule {}
