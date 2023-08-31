import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreJourneyComponent } from './pre-journey.component';

describe('PreJourneyComponent', () => {
  let component: PreJourneyComponent;
  let fixture: ComponentFixture<PreJourneyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreJourneyComponent]
    });
    fixture = TestBed.createComponent(PreJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
