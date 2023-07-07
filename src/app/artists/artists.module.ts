import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsComponent } from "./artists.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { ArtistService } from "./artist.service";
import { CountriesModule } from "../countries/countries.module";
import { StreamingModule } from "../streaming/streaming.module";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [CommonModule, ArtistsRoutingModule, CountriesModule, StreamingModule],
  providers: [ArtistService],
})
export class ArtistsModule {}
