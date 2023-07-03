import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SelectionPageComponent } from "./selection-page/selection-page.component";
import { AuthorizationGateComponent } from "./authorization-gate/authorization-gate.component";
import { HttpClientModule } from "@angular/common/http";
import { WorldMapComponent } from './world-map/world-map.component';

@NgModule({
  declarations: [AppComponent, SelectionPageComponent, AuthorizationGateComponent, WorldMapComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
