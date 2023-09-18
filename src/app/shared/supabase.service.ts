import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, asyncScheduler, map, scheduled, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { ScrapedArtist, Suggestion } from "../artists/artist.model";
import {
  CountryPopularity,
  CountryPopularityPartial,
  CountryPopularityResponse,
  DiversityIndex,
  DiversityIndexResponse,
  LastFmTopArtists,
  LastFmUserResponse,
} from "./supabase.model";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabaseClient!: SupabaseClient;

  constructor(private userService: UserService) {
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
      const country_code =
        scrapedArtist.country?.NE_ID == -1 ? undefined : scrapedArtist.country?.NE_ID;

      return {
        artist_name: scrapedArtist.name,
        country_code: country_code,
      };
    });

    scheduled(
      this.supabaseClient.functions.invoke<Suggestion[]>("save-suggestions", {
        body: JSON.stringify(suggestions),
      }),
      asyncScheduler
    ).subscribe();
  }

  saveDiversityIndex(countriesCount: number): void {
    if (countriesCount == 0) return;
    const user = this.userService.getUser();

    if (user) {
      const userData = {
        user_id: user.id,
        user_countries_count: countriesCount,
        user_country_code: user.countryCode,
      };

      scheduled(
        this.supabaseClient.functions.invoke<Suggestion[]>("save-user-diversity-index", {
          body: JSON.stringify(userData),
        }),
        asyncScheduler
      ).subscribe();
    }
  }

  getLastFmUserProfileData(userName: string): Observable<LastFmUserResponse> {
    return scheduled(
      this.supabaseClient.functions.invoke<LastFmUserResponse>("get-lastfm-user-profile-data", {
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

  getDiversityIndexes(): Observable<DiversityIndex[]> {
    return scheduled(
      this.supabaseClient.from("diversity_indexes").select("*"),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => response.data || []),
      map((data: DiversityIndexResponse[]) =>
        data.map((data) => {
          return {
            countryCode: data.country_code,
            countriesCount: data.countries_count,
            occurrenceQuantity: data.occurrence_quantity,
          } as DiversityIndex;
        })
      )
    );
  }

  getCountriesPopularity(): Observable<CountryPopularityPartial[]> {
    return scheduled(
      this.supabaseClient.from("countries_popularity").select("*"),
      asyncScheduler
    ).pipe(
      take(1),
      map((response) => response.data || []),
      tap((data) => console.log(data)),
      map((data: CountryPopularityResponse[]) =>
        data.map((data): CountryPopularityPartial => {
          return {
            countryCode: data.country_code,
            popularity: data.popularity,
          };
        })
      )
    );
  }
}
