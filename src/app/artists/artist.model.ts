import { Country } from "../country/country.model";

export interface Artist {
  id?: number;
  name: string;
  country: Country | undefined;
}

export interface ArtistWithSuggestion extends Artist {
  suggestedCountry: Country | undefined;
}

export interface ScrapedArtist {
  name: string;
  country: Country | undefined;
}

export interface Suggestion {
  artist: Artist;
  suggestedCountry: Country | undefined;
}

export interface ArtistFromDatabase {
  id: number;
  name: string;
  country_id: number;
}

export interface SavedArtist {
  id: number;
  name: string;
}
