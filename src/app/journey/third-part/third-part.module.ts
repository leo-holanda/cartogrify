import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThirdPartComponent } from "./third-part.component";

@NgModule({
  declarations: [ThirdPartComponent],
  imports: [CommonModule],
  exports: [ThirdPartComponent],
})
export class ThirdPartModule {}
