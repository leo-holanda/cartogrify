import { Country } from "../country/country.model";

export interface LastFmTopArtists {
  topartists?: TopArtists;
  error?: number;
  message?: string;
}

interface TopArtists {
  artist: Artist[];
  "@attr": Attr2;
}

interface Artist {
  streamable: string;
  image: Image[];
  mbid: string;
  url: string;
  playcount: string;
  "@attr": Attr;
  name: string;
}

interface Image {
  size: string;
  "#text": string;
}

interface Attr {
  rank: string;
}

interface Attr2 {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface LastFmUserResponse {
  user?: LastFmUser;
  error?: number;
  message?: string;
}

export interface ProfileImage {
  size: string;
  "#text": string;
}

export interface Registered {
  unixtime: string;
  "#text": number;
}

export interface LastFmUser {
  name: string;
  age: string;
  subscriber: string;
  realname: string;
  bootstrap: string;
  playcount: string;
  artist_count: string;
  playlists: string;
  track_count: string;
  album_count: string;
  image: ProfileImage[];
  registered: Registered;
  country: string;
  gender: string;
  url: string;
  type: string;
}

export interface DiversityIndexResponse {
  country_code: number | undefined;
  countries_count: number;
  occurrence_quantity: number;
}

export interface DiversityIndex {
  countryCode: number | undefined;
  countriesCount: number;
  occurrenceQuantity: number;
}

export interface CountryPopularityResponse {
  country_code: number | undefined;
  popularity: number;
}

export interface CountryPopularityPartial {
  countryCode: number | undefined;
  popularity: number;
}

export interface CountryPopularity {
  country: Country | undefined;
  popularity: number;
}

export interface LastFmArtistResponse {
  artist?: LastFmArtist;
  error?: number;
  message?: string;
}

export interface LastFmArtist {
  name: string;
  url: string;
  image?: ImageEntity[] | null;
  streamable: string;
  ontour: string;
  stats: Stats;
  similar: Similar;
  tags: Tags;
  bio: Bio;
}
export interface ImageEntity {
  "#text": string;
  size: string;
}
export interface Stats {
  listeners: string;
  playcount: string;
}
export interface Similar {
  artist?: ArtistEntity[] | null;
}
export interface ArtistEntity {
  name: string;
  url: string;
  image?: ImageEntity[] | null;
}
export interface Tags {
  tag?: TagEntity[] | null;
}
export interface TagEntity {
  name: string;
  url: string;
}
export interface Bio {
  links: Links;
  published: string;
  summary: string;
  content: string;
}
export interface Links {
  link: Link;
}
export interface Link {
  "#text": string;
  rel: string;
  href: string;
}
