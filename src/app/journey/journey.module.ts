import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { FirstActComponent } from "./first-act/first-act.component";
import { FirstActModule } from "./first-act/first-act.module";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [CommonModule, JourneyRoutingModule, WorldMapModule, FirstActModule],
  exports: [FirstActComponent],
})
export class JourneyModule {}
