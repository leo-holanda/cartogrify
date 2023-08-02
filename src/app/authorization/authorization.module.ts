import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { PostLoginComponent } from "./post-login/post-login.component";
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [PostLoginComponent, LoginComponent],
  imports: [CommonModule, AuthorizationRoutingModule, FormsModule],
  providers: [],
})
export class AuthorizationModule {}
