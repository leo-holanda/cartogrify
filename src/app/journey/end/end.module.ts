import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EndComponent } from "./end.component";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [EndComponent],
  imports: [CommonModule, ButtonModule],
  exports: [EndComponent],
})
export class EndModule {}
