import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { hasRequestedTopArtists } from "./core/top-artists-request.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./authorization/authorization.module").then((m) => m.AuthorizationModule),
  },
  {
    path: "artists",
    loadChildren: () => import("./artists/artists.module").then((m) => m.ArtistsModule),
    canActivate: [hasRequestedTopArtists],
  },
  {
    path: "journey",
    loadChildren: () => import("./journey/journey.module").then((m) => m.JourneyModule),
    canActivate: [hasRequestedTopArtists],
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
