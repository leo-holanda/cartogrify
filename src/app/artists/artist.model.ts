import { Country } from "../country/country.model";

export interface Artist {
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
  artist_name: string;
  country_code?: number;
}

export interface ArtistFromDatabase {
  artist_name: string;
  country_code?: number;
}
