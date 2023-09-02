import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { CountriesCountModule } from "./countries-count/countries-count.module";
import { SecondPartModule } from "./second-part/second-part.module";
import { CountriesCountComponent } from "./countries-count/countries-count.component";
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
    CountriesCountModule,
    SecondPartModule,
    ThirdPartModule,
    FourthPartModule,
    FifthPartModule,
  ],
  exports: [
    CountriesCountComponent,
    SecondPartComponent,
    ThirdPartComponent,
    FourthPartComponent,
    FifthPartComponent,
  ],
})
export class JourneyModule {}
