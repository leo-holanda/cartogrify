import { Artist } from "./artist.model";

export function transformNamesInArtists(responseItems: SpotifyApi.ArtistObjectFull[]): Artist[] {
  return responseItems.map((artist): Artist => createArtist(artist));
}

export function createArtist(artist: SpotifyApi.ArtistObjectFull): Artist {
  return {
    name: artist.name,
    country: undefined,
    url: artist.href,
  };
}
