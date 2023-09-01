import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { FirstPartModule } from "./first-part/first-part.module";
import { SecondPartModule } from "./second-part/second-part.module";
import { FirstPartComponent } from "./first-part/first-part.component";
import { SecondPartComponent } from "./second-part/second-part.component";
import { ThirdActComponent } from "./third-act/third-act.component";
import { ThirdActModule } from "./third-act/third-act.module";
import { FourthActComponent } from "./fourth-act/fourth-act.component";
import { FourthActModule } from "./fourth-act/fourth-act.module";
import { FifthActComponent } from "./fifth-act/fifth-act.component";
import { FifthActModule } from "./fifth-act/fifth-act.module";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [
    CommonModule,
    JourneyRoutingModule,
    WorldMapModule,
    FirstPartModule,
    SecondPartModule,
    ThirdActModule,
    FourthActModule,
    FifthActModule,
  ],
  exports: [
    FirstPartComponent,
    SecondPartComponent,
    ThirdActComponent,
    FourthActComponent,
    FifthActModule,
  ],
})
export class JourneyModule {}
