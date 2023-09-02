import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CountriesStatsComponent } from "./countries-stats.component";

describe("CountriesStatsComponent", () => {
  let component: CountriesStatsComponent;
  let fixture: ComponentFixture<CountriesStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesStatsComponent],
    });
    fixture = TestBed.createComponent(CountriesStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
