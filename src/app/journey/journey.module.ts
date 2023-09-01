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
import { FourthPartComponent } from "./fourth-part/fourth-part.component";
import { FourthPartModule } from "./fourth-part/fourth-part.module";
import { FifthPartComponent } from "./fifth-part/fifth-part.component";
import { FifthPartModule } from "./fifth-part/fifth-part.module";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [
    CommonModule,
    JourneyRoutingModule,
    WorldMapModule,
    FirstPartModule,
    SecondPartModule,
    ThirdPartModule,
    FourthPartModule,
    FifthPartModule,
  ],
  exports: [
    FirstPartComponent,
    SecondPartComponent,
    ThirdPartComponent,
    FourthPartComponent,
    FifthPartComponent,
  ],
})
export class JourneyModule {}
