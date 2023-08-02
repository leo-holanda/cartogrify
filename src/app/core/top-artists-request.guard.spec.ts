import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { hasRequestedTopArtists } from "./top-artists-request.guard";

describe("hasFetchedTopArtistsGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => hasRequestedTopArtists(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
