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
  secondaryLocation: string | undefined;
}

export interface Suggestion {
  artist_name: string;
  country_code?: number;
}

export interface ArtistFromDatabase {
  artist_name: string;
  country_code?: number;
}

export interface ScrapedArtistData {
  artist: ScrapedArtist;
  total: number;
  remanining: number;
}

export enum ArtistsSources {
  SPOTIFY = "spotify",
  LASTFM = "lastfm",
}

export interface RawMusicBrainzArtistData {
  name: string;
  data: string;
}

export interface MusicBrainzArtistData {
  name: string;
  artistDataFromMusicBrainz: MusicBrainzArtist | undefined;
}

export interface MusicBrainzArtist {
  name: string;
  country: string;
  area: MusicBrainzArea;
  "begin-area": MusicBrainzArea;
  "end-area": MusicBrainzArea;
}

export interface MusicBrainzArea {
  type: string;
  name: string;
}
