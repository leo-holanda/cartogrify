import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegionsCountComponent } from "./regions-count.component";

describe("RegionsCountComponent", () => {
  let component: RegionsCountComponent;
  let fixture: ComponentFixture<RegionsCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionsCountComponent],
    });
    fixture = TestBed.createComponent(RegionsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
