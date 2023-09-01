import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ThirdPartComponent } from "./third-part.component";

describe("ThirdPartComponent", () => {
  let component: ThirdPartComponent;
  let fixture: ComponentFixture<ThirdPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdPartComponent],
    });
    fixture = TestBed.createComponent(ThirdPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
