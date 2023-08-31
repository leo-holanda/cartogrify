import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [CommonModule, JourneyRoutingModule, WorldMapModule],
})
export class JourneyModule {}
