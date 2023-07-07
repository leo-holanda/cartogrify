import { TestBed } from '@angular/core/testing';

import { SpotifyAuthService } from './spotify-auth.service';

describe('SpotifyAuthService', () => {
  let service: SpotifyAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
