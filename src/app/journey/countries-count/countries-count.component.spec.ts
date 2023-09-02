import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CountriesCountComponent } from "./countries-count.component";

describe("CountriesCountComponent", () => {
  let component: CountriesCountComponent;
  let fixture: ComponentFixture<CountriesCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesCountComponent],
    });
    fixture = TestBed.createComponent(CountriesCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
