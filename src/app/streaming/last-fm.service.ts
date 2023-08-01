import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  constructor(private supabaseService: SupabaseService) {}

  getTopArtists(userName: string): Observable<string[]> {
    return this.supabaseService.getLastFmUserTopArtists(userName).pipe(
      map((response) => {
        if (!response) return [];
        return response.topartists.artist.map((artist) => artist.name);
      })
    );
  }
}
