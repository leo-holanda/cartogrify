import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorldMapModule } from "../artists/world-map/world-map.module";
import { JourneyRoutingModule } from "./journey-routing.module";
import { CountriesStatsModule } from "./countries-stats/countries-stats.module";
import { CountriesCountComponent } from "./countries-count/countries-count.component";
import { CountriesStatsComponent } from "./countries-stats/countries-stats.component";
import { RegionsCountComponent } from "./regions-count/regions-count.component";
import { RegionsCountModule } from "./regions-count/regions-count.module";
import { MapPartComponent } from "./map-part/map-part.component";
import { MapPartModule } from "./map-part/map-part.module";
import { ArtistsPartModule } from "./artists-part/artists-part.module";
import { ArtistsPartComponent } from "./artists-part/artists-part.component";
import { PreJourneyModule } from "./pre-journey/pre-journey.module";
import { IntroComponent } from "./intro/intro.component";
import { IntroModule } from "./intro/intro.module";
import { EndComponent } from "./end/end.component";
import { EndModule } from "./end/end.module";
import { CountriesRanksModule } from "./countries-ranks/countries-ranks.module";
import { CountriesRanksComponent } from "./countries-ranks/countries-ranks.component";
import { CountriesCountModule } from "./countries-count/countries-count.module";

@NgModule({
  declarations: [],
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
  ],
})
export class JourneyModule {}
