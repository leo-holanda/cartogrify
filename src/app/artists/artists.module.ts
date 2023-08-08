import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsComponent } from "./artists.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { StreamingModule } from "../streaming/streaming.module";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [CommonModule, ArtistsRoutingModule, StreamingModule],
  providers: [],
})
export class ArtistsModule {}
