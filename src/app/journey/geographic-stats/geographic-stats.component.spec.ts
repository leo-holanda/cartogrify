import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicStatsComponent } from './geographic-stats.component';

describe('GeographicStatsComponent', () => {
  let component: GeographicStatsComponent;
  let fixture: ComponentFixture<GeographicStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeographicStatsComponent]
    });
    fixture = TestBed.createComponent(GeographicStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
