import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MapTheme, mapThemes } from "../world-map/world-map.themes";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  mapTheme = new BehaviorSubject<MapTheme>(mapThemes[0]);

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
