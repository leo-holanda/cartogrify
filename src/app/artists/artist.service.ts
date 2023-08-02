import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  private userTopArtists: string[] = [];

  setUserTopArtists(topArtists: string[]): void {
    this.userTopArtists = [...topArtists];
  }

  getUserTopArtists(): string[] {
    return [...this.userTopArtists];
  }
}
