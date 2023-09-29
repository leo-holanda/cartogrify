import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GeographicStatsComponent } from "./geographic-stats.component";

@NgModule({
  declarations: [GeographicStatsComponent],
  imports: [CommonModule],
  exports: [GeographicStatsComponent],
})
export class GeographicStatsModule {}
