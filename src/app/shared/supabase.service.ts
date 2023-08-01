import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, from, map, take } from "rxjs";
import { environment } from "src/environments/environment";
import { Artist } from "../artists/artist.model";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  getArtistsByName(artists: string[]): Observable<Artist[]> {
    const normalizedArtistsNames = artists.map((artist) => artist.toLowerCase());
    return from(
      this.supabaseClient.from("artists").select("name, country").in("name", normalizedArtistsNames)
    ).pipe(
      take(1),
      map((response) => response.data || [])
    );
  }

  saveArtists(artists: Artist[]): void {
    const missingArtists = artists.map((artist) => {
      return {
        name: artist.name.toLowerCase(),
        country: artist.country,
      };
    });

    this.supabaseClient.functions.invoke("save-missing-artists", {
      body: missingArtists,
    });
  }
}
