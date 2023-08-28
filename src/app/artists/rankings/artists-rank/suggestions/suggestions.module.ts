import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { SuggestionsComponent } from "./suggestions.component";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { TabViewModule } from "primeng/tabview";
import { ButtonModule } from "primeng/button";
import { ChipModule } from "primeng/chip";

@NgModule({
  declarations: [SuggestionsComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    DropdownModule,
    TabViewModule,
    ButtonModule,
    ChipModule,
  ],
  exports: [SuggestionsComponent],
})
export class SuggestionsModule {}
