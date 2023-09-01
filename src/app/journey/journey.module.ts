import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { FirstPartModule } from "./first-part/first-part.module";
import { SecondPartModule } from "./second-part/second-part.module";
import { FirstPartComponent } from "./first-part/first-part.component";
import { SecondPartComponent } from "./second-part/second-part.component";
import { ThirdPartComponent } from "./third-part/third-part.component";
import { ThirdPartModule } from "./third-part/third-part.module";
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
    ThirdPartModule,
    FourthActModule,
    FifthActModule,
  ],
  exports: [
    FirstPartComponent,
    SecondPartComponent,
    ThirdPartComponent,
    FourthActComponent,
    FifthActModule,
  ],
})
export class JourneyModule {}
