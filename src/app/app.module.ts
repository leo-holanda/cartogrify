import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ArtistsModule } from "./artists/artists.module";
import { AuthorizationModule } from "./authorization/authorization.module";
import { CountriesModule } from "./countries/countries.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthorizationModule,
    ArtistsModule,
    CountriesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
