import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { FirstActModule } from "./first-act/first-act.module";
import { SecondActModule } from "./second-act/second-act.module";
import { FirstActComponent } from "./first-act/first-act.component";
import { SecondActComponent } from "./second-act/second-act.component";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [CommonModule, JourneyRoutingModule, WorldMapModule, FirstActModule, SecondActModule],
  exports: [FirstActComponent, SecondActComponent],
})
export class JourneyModule {}
