import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, from, map, take } from "rxjs";
import { Artist } from "./artist.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
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

  saveArtist(artists: Artist[]): void {
    const newArtists = [];

    artists.forEach((artist) => {
      if (artist.country) {
        artist.name = artist.name.toLocaleLowerCase();
        newArtists.push(artist);
      }
    });

    from(this.supabaseClient.from("artists").insert(artists))
      .pipe(take(1))
      .subscribe((response) => console.log(response));
  }
}
