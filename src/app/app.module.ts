import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthorizationModule } from "./authorization/authorization.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JourneyComponent } from "./journey/journey.component";
import { JourneyModule } from "./journey/journey.module";

@NgModule({
  declarations: [AppComponent, JourneyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthorizationModule,
    BrowserAnimationsModule,
    JourneyModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
