import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionsRankComponent } from './regions-rank.component';

describe('RegionsRankComponent', () => {
  let component: RegionsRankComponent;
  let fixture: ComponentFixture<RegionsRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionsRankComponent]
    });
    fixture = TestBed.createComponent(RegionsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
