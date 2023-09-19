import { TestBed } from '@angular/core/testing';

import { WebScrapingService } from './web-scraping.service';

describe('WebScrapingService', () => {
  let service: WebScrapingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebScrapingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
