import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FourthPartComponent } from "./fourth-part.component";

describe("FourthPartComponent", () => {
  let component: FourthPartComponent;
  let fixture: ComponentFixture<FourthPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FourthPartComponent],
    });
    fixture = TestBed.createComponent(FourthPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
