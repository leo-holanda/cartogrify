import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { PostLoginComponent } from "./post-login/post-login.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SidebarModule } from "primeng/sidebar";
import { LoginModule } from "./login/login.module";

@NgModule({
  declarations: [PostLoginComponent],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule,
    SidebarModule,
    LoginModule,
  ],
  providers: [MessageService],
})
export class AuthorizationModule {}
