import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapPartComponent } from "./map-part.component";
import { WorldMapModule } from "src/app/artists/world-map/world-map.module";

@NgModule({
  declarations: [MapPartComponent],
  imports: [CommonModule, WorldMapModule],
  exports: [MapPartComponent],
})
export class MapPartModule {}
