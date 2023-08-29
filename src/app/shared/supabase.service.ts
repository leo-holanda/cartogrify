import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, map, scheduled, take } from "rxjs";
import { environment } from "src/environments/environment";
import { ScrapedArtist, Suggestion } from "../artists/artist.model";
import { LastFmTopArtists } from "./supabase.model";
import { User } from "../user/user.model";

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

  saveSuggestions(scrapedArtists: ScrapedArtist[]): void {
    const suggestions = scrapedArtists.map((scrapedArtist) => {
      return {
        artist_name: scrapedArtist.name,
        country_code: scrapedArtist.country?.NE_ID,
      };
    });

    scheduled(
      this.supabaseClient.functions.invoke<Suggestion[]>("save-suggestions", {
        body: JSON.stringify(suggestions),
      }),
      asyncScheduler
    ).subscribe();
  }

  saveDiversityIndex(user: User, diversityIndex: number): void {
    const userData = {
      user_id: user.id,
      diversity_index: diversityIndex,
      user_country: user.country,
    };

    scheduled(
      this.supabaseClient.functions.invoke<Suggestion[]>("save-user-diversity-index", {
        body: JSON.stringify(userData),
      }),
      asyncScheduler
    ).subscribe();
  }
}
