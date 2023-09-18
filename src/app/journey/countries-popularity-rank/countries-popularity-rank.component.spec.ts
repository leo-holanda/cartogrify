import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesPopularityRankComponent } from './countries-popularity-rank.component';

describe('CountriesPopularityRankComponent', () => {
  let component: CountriesPopularityRankComponent;
  let fixture: ComponentFixture<CountriesPopularityRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesPopularityRankComponent]
    });
    fixture = TestBed.createComponent(CountriesPopularityRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
