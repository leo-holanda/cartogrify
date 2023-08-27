import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, map, scheduled, take } from "rxjs";
import { environment } from "src/environments/environment";
import { ArtistFromDatabase, ScrapedArtist, Suggestion } from "../artists/artist.model";
import { LastFmTopArtists } from "./supabase.model";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_ANON_KEY);
  }

  getBestSuggestionByArtists(artists: string[]): Observable<Suggestion[]> {
    return scheduled(
      this.supabaseClient
        .from("suggestions_rank")
        .select("artist_name, country_code")
        .in("artist_name", artists),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => response.data || [])
    );
  }

  getLastFmUserTopArtists(userName: string): Observable<LastFmTopArtists> {
    return scheduled(
      this.supabaseClient.functions.invoke<LastFmTopArtists>("fetch-lastfm-top-artists", {
        body: { name: userName },
      }),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => {
        //This is a Supabase Edge Function error
        if (response.error) throw new Error(response.error);
        if (!response.data) throw new Error(response.error);
        return response.data;
      })
    );
  }

  saveSuggestions(scrappedArtists: ScrapedArtist[]): void {
    const suggestions = scrappedArtists.map((scrappedArtist) => {
      return {
        artist_name: scrappedArtist.name,
        country_code: scrappedArtist.country?.NE_ID,
      };
    });

    scheduled(
      this.supabaseClient.functions.invoke<Suggestion[]>("save-suggestions", {
        body: JSON.stringify(suggestions),
      }),
      asyncScheduler
    ).subscribe();
  }

  incrementDiversityIndexOccurence(diversityIndex: number): void {
    scheduled(
      this.supabaseClient.rpc("incrementdiversityindexocurrence", {
        provided_diversity_index: diversityIndex,
      }),
      asyncScheduler
    ).subscribe();
  }
}
