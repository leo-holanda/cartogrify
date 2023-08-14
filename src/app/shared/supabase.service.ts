import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, from, map, scheduled, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Artist, ArtistWithSuggestion, Suggestion } from "../artists/artist.model";
import { LastFmTopArtists } from "./supabase.model";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabaseClient!: SupabaseClient;

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
      map((response) => response.data || []),
      tap((artists) => {
        this.saveSuggestions(
          artists
            .filter((artist) => artist.country)
            .map((artist) => {
              return {
                artist: artist,
                suggestedCountry: artist.country,
              } as Suggestion;
            })
        );
      })
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

  saveSuggestions(suggestionsToSave: Suggestion[]): void {
    const suggestions = suggestionsToSave.map((suggestion) => {
      return {
        artist_id: suggestion.artist.id,
        country_id: suggestion.suggestedCountry.NE_ID,
      };
    });

    console.log(suggestions);
    scheduled(
      this.supabaseClient.functions.invoke<Suggestion[]>("save-suggestions", {
        body: JSON.stringify(suggestions),
      }),
      asyncScheduler
    ).subscribe();
  }
}
