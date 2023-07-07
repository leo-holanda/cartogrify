import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArtistsComponent } from "./artists.component";

const routes: Routes = [{ path: "", component: ArtistsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistsRoutingModule {}
