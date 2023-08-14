import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, from, map, scheduled, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Artist } from "../artists/artist.model";
import { LastFmTopArtists } from "./supabase.model";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  getArtistsByName(artists: string[]): Observable<Artist[]> {
    return from(
      this.supabaseClient.from("artists").select("id, name, country").in("name", artists)
    ).pipe(
      take(1),
      map((response) => response.data || [])
    );
  }

  saveArtists(artistsToSave: Artist[]): Observable<Artist[]> {
    return from(
      this.supabaseClient.functions.invoke<Artist[]>("save-missing-artists", {
        method: "POST",
        body: JSON.stringify(artistsToSave),
      })
    ).pipe(
      take(1),
      map((response) => response.data || [])
    );
  }

  getLastFmUserTopArtists(userName: string): Observable<LastFmTopArtists | null> {
    return scheduled(
      this.supabaseClient.functions.invoke<LastFmTopArtists>("fetch-lastfm-top-artists", {
        body: { name: userName },
      }),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => response.data)
    );
  }
}
