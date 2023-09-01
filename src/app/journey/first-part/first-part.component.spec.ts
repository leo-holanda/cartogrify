import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FirstPartComponent } from "./first-part.component";

describe("FirstPartComponent", () => {
  let component: FirstPartComponent;
  let fixture: ComponentFixture<FirstPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstPartComponent],
    });
    fixture = TestBed.createComponent(FirstPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
