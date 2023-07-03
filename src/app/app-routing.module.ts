import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SelectionPageComponent } from "./selection-page/selection-page.component";
import { AuthorizationGateComponent } from "./authorization-gate/authorization-gate.component";
import { WorldMapComponent } from "./world-map/world-map.component";

const routes: Routes = [
  { path: "", component: SelectionPageComponent },
  { path: "authorization", component: AuthorizationGateComponent },
  { path: "worldmap", component: WorldMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
