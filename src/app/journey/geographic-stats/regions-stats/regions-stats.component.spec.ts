import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionsStatsComponent } from './regions-stats.component';

describe('RegionsStatsComponent', () => {
  let component: RegionsStatsComponent;
  let fixture: ComponentFixture<RegionsStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionsStatsComponent]
    });
    fixture = TestBed.createComponent(RegionsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
