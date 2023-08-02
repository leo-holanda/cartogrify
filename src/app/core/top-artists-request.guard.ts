import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ArtistService } from "../artists/artist.service";

export const hasRequestedTopArtists: CanActivateFn = (route, state) => {
  const hasFetchedArtists = inject(ArtistService).getArtistsRequestStatus();
  const router = inject(Router);
  if (!hasFetchedArtists) router.navigate(["/"]);
  return hasFetchedArtists;
};
