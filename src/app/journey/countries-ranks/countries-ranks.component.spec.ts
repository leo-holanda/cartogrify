import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CountriesRanksComponent } from "./countries-ranks.component";

describe("CountriesRanksComponent", () => {
  let component: CountriesRanksComponent;
  let fixture: ComponentFixture<CountriesRanksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountriesRanksComponent],
    });
    fixture = TestBed.createComponent(CountriesRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
