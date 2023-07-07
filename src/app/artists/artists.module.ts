import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArtistsComponent } from "./artists.component";
import { ArtistsRoutingModule } from "./artists-routing.module";
import { ArtistService } from "./artist.service";

@NgModule({
  declarations: [ArtistsComponent],
  imports: [CommonModule, ArtistsRoutingModule],
  providers: [ArtistService],
})
export class ArtistsModule {}
