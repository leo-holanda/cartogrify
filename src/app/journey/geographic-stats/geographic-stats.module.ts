import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GeographicStatsComponent } from "./geographic-stats.component";
import { RegionsStatsModule } from "./regions-stats/regions-stats.module";
import { SubRegionsStatsModule } from "./sub-regions-stats/sub-regions-stats.module";
import { FormsModule } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";

@NgModule({
  declarations: [GeographicStatsComponent],
  imports: [
    CommonModule,
    RegionsStatsModule,
    SubRegionsStatsModule,
    FormsModule,
    SelectButtonModule,
  ],
  exports: [GeographicStatsComponent],
})
export class GeographicStatsModule {}
