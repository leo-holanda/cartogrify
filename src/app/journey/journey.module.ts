import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { CountriesCountModule } from "./countries-count/countries-count.module";
import { CountriesStatsModule } from "./countries-stats/countries-stats.module";
import { CountriesCountComponent } from "./countries-count/countries-count.component";
import { CountriesStatsComponent } from "./countries-stats/countries-stats.component";
import { RegionsCountComponent } from "./regions-count/regions-count.component";
import { RegionsCountModule } from "./regions-count/regions-count.module";
import { FifthPartComponent } from "./fifth-part/fifth-part.component";
import { FifthPartModule } from "./fifth-part/fifth-part.module";
import { ArtistsPartModule } from "./artists-part/artists-part.module";
import { ArtistsPartComponent } from "./artists-part/artists-part.component";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [
    CommonModule,
    JourneyRoutingModule,
    WorldMapModule,
    CountriesCountModule,
    CountriesStatsModule,
    RegionsCountModule,
    ArtistsPartModule,
    FifthPartModule,
  ],
  exports: [
    CountriesCountComponent,
    CountriesStatsComponent,
    RegionsCountComponent,
    ArtistsPartComponent,
    FifthPartComponent,
  ],
})
export class JourneyModule {}
