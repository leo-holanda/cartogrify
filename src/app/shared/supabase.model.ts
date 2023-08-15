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
