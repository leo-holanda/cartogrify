import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostLoginComponent } from "./post-login/post-login.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "authorization", component: PostLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationRoutingModule {}
