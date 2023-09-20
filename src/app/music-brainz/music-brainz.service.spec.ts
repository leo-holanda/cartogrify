import { TestBed } from '@angular/core/testing';

import { MusicBrainzService } from './music-brainz.service';

describe('MusicBrainzService', () => {
  let service: MusicBrainzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicBrainzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
