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
import { MapPartComponent } from "./map-part/map-part.component";
import { MapPartModule } from "./map-part/map-part.module";
import { ArtistsPartModule } from "./artists-part/artists-part.module";
import { ArtistsPartComponent } from "./artists-part/artists-part.component";
import { PreJourneyModule } from "./pre-journey/pre-journey.module";
import { IntroComponent } from "./intro/intro.component";
import { IntroModule } from "./intro/intro.module";
import { EndComponent } from "./end/end.component";
import { EndModule } from "./end/end.module";
import { CountriesDiversityModule } from "./countries-diversity/countries-diversity.module";
import { CountriesDiversityComponent } from "./countries-diversity/countries-diversity.component";

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
    CountriesDiversityModule,
  ],
  exports: [
    CountriesCountComponent,
    CountriesStatsComponent,
    RegionsCountComponent,
    ArtistsPartComponent,
    MapPartComponent,
    IntroComponent,
    EndComponent,
    CountriesDiversityComponent,
  ],
})
export class JourneyModule {}
