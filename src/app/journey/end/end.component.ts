import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "ctg-end",
  templateUrl: "./end.component.html",
  styleUrls: ["./end.component.scss"],
})
export class EndComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.router.navigate(["/"]);
  }
}
