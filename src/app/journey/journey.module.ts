import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JourneyRoutingModule } from "./journey-routing.module";
import { CountriesStatsModule } from "./countries-stats/countries-stats.module";
import { CountriesCountComponent } from "./countries-count/countries-count.component";
import { CountriesStatsComponent } from "./countries-stats/countries-stats.component";
import { RegionsCountComponent } from "./regions-count/regions-count.component";
import { RegionsCountModule } from "./regions-count/regions-count.module";
import { MapPartComponent } from "./map-part/map-part.component";
import { MapPartModule } from "./map-part/map-part.module";
import { ArtistsPartComponent } from "./artists-part/artists-part.component";
import { PreJourneyModule } from "./pre-journey/pre-journey.module";
import { IntroComponent } from "./intro/intro.component";
import { IntroModule } from "./intro/intro.module";
import { EndComponent } from "./end/end.component";
import { EndModule } from "./end/end.module";
import { CountriesRanksModule } from "./countries-ranks/countries-ranks.module";
import { CountriesRanksComponent } from "./countries-ranks/countries-ranks.component";
import { CountriesCountModule } from "./countries-count/countries-count.module";
import { ArtistsPartModule } from "./artists-part/artists-part.module";
import { WorldMapModule } from "../world-map/world-map.module";
import { RegionsStatsComponent } from "./regions-stats/regions-stats.component";
import { RegionsStatsModule } from "./regions-stats/regions-stats.module";
import { SubRegionsStatsComponent } from "./sub-regions-stats/sub-regions-stats.component";
import { SubRegionsStatsModule } from "./sub-regions-stats/sub-regions-stats.module";

@NgModule({
  imports: [
    CommonModule,
    JourneyRoutingModule,
    PreJourneyModule,
    WorldMapModule,
    CountriesCountModule,
    CountriesStatsModule,
    RegionsCountModule,
    ArtistsPartModule,
    MapPartModule,
    IntroModule,
    EndModule,
    CountriesRanksModule,
    RegionsStatsModule,
    SubRegionsStatsModule,
  ],
  exports: [
    CountriesCountComponent,
    CountriesStatsComponent,
    RegionsCountComponent,
    ArtistsPartComponent,
    MapPartComponent,
    IntroComponent,
    EndComponent,
    CountriesRanksComponent,
    RegionsStatsComponent,
    SubRegionsStatsComponent,
  ],
})
export class JourneyModule {}
