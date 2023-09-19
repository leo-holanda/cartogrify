import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PreJourneyComponent } from "./pre-journey/pre-journey.component";
import { JourneyComponent } from "./journey.component";

const routes: Routes = [
  { path: "loading", component: PreJourneyComponent },
  { path: "", component: JourneyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyRoutingModule {}
