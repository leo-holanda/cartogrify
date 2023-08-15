import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, map, scheduled, take } from "rxjs";
import { environment } from "src/environments/environment";
import { ArtistFromDatabase, SavedArtist, Suggestion } from "../artists/artist.model";
import { LastFmTopArtists } from "./supabase.model";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  getArtistsByName(artists: string[]): Observable<ArtistFromDatabase[]> {
    return scheduled(
      this.supabaseClient
        .from("highest_suggestion_by_artist")
        .select("id, name, country_id")
        .in("name", artists),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => response.data || [])
    );
  }

  saveArtists(artistsNames: string[]): Observable<SavedArtist[]> {
    const artistsToSave = artistsNames.map((artistName) => {
      return {
        name: artistName,
      };
    });

    return scheduled(
      this.supabaseClient.functions.invoke<SavedArtist[]>("save-missing-artists", {
        method: "POST",
        body: JSON.stringify(artistsToSave),
      }),
      asyncScheduler
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

  saveSuggestions(suggestionsToSave: Suggestion[]): void {
    const suggestions = suggestionsToSave.map((suggestion) => {
      return {
        artist_id: suggestion.artist.id,
        country_id: suggestion.suggestedCountry?.NE_ID || null,
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
