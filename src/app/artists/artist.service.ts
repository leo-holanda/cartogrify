import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, from, map, take } from "rxjs";
import { Artist } from "./artist.model";

@Injectable({
  providedIn: "root",
})
export class ArtistService {
  supabaseClient!: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      "https:vjknjigknvleyfpqwois.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqa25qaWdrbnZsZXlmcHF3b2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0ODAzMjgsImV4cCI6MjAwNDA1NjMyOH0.cO-zjhPoFgpKtD1VXDkbhf_fAn1vic9GFpkL-gm-gyY"
    );
  }

  getArtists(artists: string[]): Observable<Artist[] | null> {
    const normalizedArtistsNames = artists.map((artist) => artist.toLowerCase());
    return from(
      this.supabaseClient.from("artists").select("name, country").in("name", normalizedArtistsNames)
    ).pipe(
      take(1),
      map((response) => response.data)
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
