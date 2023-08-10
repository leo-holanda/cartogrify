import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthorizationModule } from "./authorization/authorization.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SuggestionsModule } from "./suggestions/suggestions.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthorizationModule,
    BrowserAnimationsModule,
    SuggestionsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
