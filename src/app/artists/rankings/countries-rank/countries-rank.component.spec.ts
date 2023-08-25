import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesRankComponent } from './countries-rank.component';

describe('CountriesRankComponent', () => {
  let component: CountriesRankComponent;
  let fixture: ComponentFixture<CountriesRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesRankComponent]
    });
    fixture = TestBed.createComponent(CountriesRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
