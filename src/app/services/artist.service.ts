import { Injectable } from "@angular/core";
import { PostgrestSingleResponse, SupabaseClient, createClient } from "@supabase/supabase-js";
import { Observable, from, map, take } from "rxjs";

interface Artist {
  name: string;
  country: string;
}

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

  getArtistsData(artists: string[]): Observable<Artist[] | null> {
    const normalizedArtistsNames = artists.map((artist) => artist.toLowerCase());
    return from(
      this.supabaseClient.from("artists").select("name, country").in("name", normalizedArtistsNames)
    ).pipe(
      take(1),
      map((response) => response.data)
    );
  }
}
