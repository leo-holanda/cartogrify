import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MapPartComponent } from "./map-part.component";

describe("MapPartComponent", () => {
  let component: MapPartComponent;
  let fixture: ComponentFixture<MapPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapPartComponent],
    });
    fixture = TestBed.createComponent(MapPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
