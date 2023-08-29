import { Injectable } from "@angular/core";
import { SupabaseService } from "../shared/supabase.service";
import { Observable, map } from "rxjs";
import { LastFmUser } from "../shared/supabase.model";

@Injectable({
  providedIn: "root",
})
export class LastFmService {
  constructor(private supabaseService: SupabaseService) {}

  getTopArtists(userName: string): Observable<string[]> {
    return this.supabaseService.getLastFmUserTopArtists(userName).pipe(
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.topartists) return response.topartists.artist.map((artist) => artist.name);
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      })
    );
  }

  getLastFmUserProfileData(userName: string): Observable<LastFmUser> {
    return this.supabaseService.getLastFmUserProfileData(userName).pipe(
      map((response) => {
        if (response.error && response.message) throw new Error(response.message);
        if (response.user) return response.user;
        throw new Error("The LastFM API is in a bad mood. Please, try again later.");
      })
    );
  }
}
