import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesDiversityRankComponent } from './countries-diversity-rank.component';

describe('CountriesDiversityRankComponent', () => {
  let component: CountriesDiversityRankComponent;
  let fixture: ComponentFixture<CountriesDiversityRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesDiversityRankComponent]
    });
    fixture = TestBed.createComponent(CountriesDiversityRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
