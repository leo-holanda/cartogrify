import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesDiversityComponent } from './countries-diversity.component';

describe('CountriesDiversityComponent', () => {
  let component: CountriesDiversityComponent;
  let fixture: ComponentFixture<CountriesDiversityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesDiversityComponent]
    });
    fixture = TestBed.createComponent(CountriesDiversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
