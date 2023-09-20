import { Artist } from "./artist.model";

export function transformNamesInArtists(artistsNames: string[]): Artist[] {
  return artistsNames.map((artistName): Artist => createArtist(artistName));
}

export function createArtist(artistName: string): Artist {
  return {
    name: artistName,
    country: undefined,
  };
}
