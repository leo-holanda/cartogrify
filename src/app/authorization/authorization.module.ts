import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationGateComponent } from "./authorization-gate/authorization-gate.component";
import { SelectionPageComponent } from "./selection-page/selection-page.component";
import { AuthorizationRoutingModule } from "./authorization-routing.module";

@NgModule({
  declarations: [AuthorizationGateComponent, SelectionPageComponent],
  imports: [CommonModule, AuthorizationRoutingModule],
})
export class AuthorizationModule {}
