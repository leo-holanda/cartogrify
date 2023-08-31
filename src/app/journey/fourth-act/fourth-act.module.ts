import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FourthActComponent } from "./fourth-act.component";
import { ArtistsRankModule } from "src/app/artists/rankings/artists-rank/artists-rank.module";

@NgModule({
  declarations: [FourthActComponent],
  imports: [CommonModule, ArtistsRankModule],
  exports: [FourthActComponent],
})
export class FourthActModule {}
