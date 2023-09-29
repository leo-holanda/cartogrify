import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRegionsStatsComponent } from './sub-regions-stats.component';

describe('SubRegionsStatsComponent', () => {
  let component: SubRegionsStatsComponent;
  let fixture: ComponentFixture<SubRegionsStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubRegionsStatsComponent]
    });
    fixture = TestBed.createComponent(SubRegionsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
