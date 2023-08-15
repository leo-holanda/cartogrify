import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { PostLoginComponent } from "./post-login/post-login.component";
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@NgModule({
  declarations: [PostLoginComponent, LoginComponent],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class AuthorizationModule {}
