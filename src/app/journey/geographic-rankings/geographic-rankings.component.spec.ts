import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicRankingsComponent } from './geographic-rankings.component';

describe('GeographicRankingsComponent', () => {
  let component: GeographicRankingsComponent;
  let fixture: ComponentFixture<GeographicRankingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeographicRankingsComponent]
    });
    fixture = TestBed.createComponent(GeographicRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
