import { Injectable } from "@angular/core";
import { MapTheme, mapThemes } from "../artists/world-map/world-map.themes";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  mapTheme = new BehaviorSubject<MapTheme>(mapThemes[0]);

  constructor() {}

  getMapTheme(): Observable<MapTheme> {
    return this.mapTheme.asObservable();
  }

  setMapTheme(newMapTheme: MapTheme): void {
    this.mapTheme.next(newMapTheme);
  }

  setMapThemeBackground(newMapBackground: string) {
    const currentMapTheme = { ...this.mapTheme.getValue() };
    currentMapTheme.background = newMapBackground;
    this.mapTheme.next(currentMapTheme);
  }
}
