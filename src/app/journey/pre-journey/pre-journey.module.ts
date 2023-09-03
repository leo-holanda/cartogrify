import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreJourneyComponent } from "./pre-journey.component";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";

@NgModule({
  declarations: [PreJourneyComponent],
  imports: [CommonModule, ProgressBarModule, ToastModule],
  exports: [PreJourneyComponent],
})
export class PreJourneyModule {}
