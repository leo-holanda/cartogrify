import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./authorization/authorization.module").then((m) => m.AuthorizationModule),
  },
  {
    path: "artists",
    loadChildren: () => import("./artists/artists.module").then((m) => m.ArtistsModule),
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
