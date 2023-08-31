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
