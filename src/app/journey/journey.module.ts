import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { FirstActModule } from "./first-act/first-act.module";
import { SecondActModule } from "./second-act/second-act.module";
import { FirstActComponent } from "./first-act/first-act.component";
import { SecondActComponent } from "./second-act/second-act.component";
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
    FirstActModule,
    SecondActModule,
    ThirdActModule,
    FourthActModule,
    FifthActModule,
  ],
  exports: [
    FirstActComponent,
    SecondActComponent,
    ThirdActComponent,
    FourthActComponent,
    FifthActModule,
  ],
})
export class JourneyModule {}
