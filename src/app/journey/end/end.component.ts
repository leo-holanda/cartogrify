import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ArtistsSources } from "src/app/artists/artist.model";
import { ArtistService } from "src/app/artists/artist.service";

@Component({
  selector: "ctg-end",
  templateUrl: "./end.component.html",
  styleUrls: ["./end.component.scss"],
})
export class EndComponent implements OnInit {
  artistSource!: ArtistsSources;
  artistsSource = ArtistsSources;

  constructor(private router: Router, private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistSource = this.artistService.getSource();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(["/"]);
  }
}
