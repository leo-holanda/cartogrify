import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArtistsPartComponent } from "./artists-part.component";

describe("ArtistsPartComponent", () => {
  let component: ArtistsPartComponent;
  let fixture: ComponentFixture<ArtistsPartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistsPartComponent],
    });
    fixture = TestBed.createComponent(ArtistsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
