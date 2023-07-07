import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { SpotifyAuthService } from "./spotify-auth.service";
import { PostLoginComponent } from "./post-login/post-login.component";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [PostLoginComponent, LoginComponent],
  imports: [CommonModule, AuthorizationRoutingModule],
  providers: [SpotifyAuthService],
})
export class AuthorizationModule {}
