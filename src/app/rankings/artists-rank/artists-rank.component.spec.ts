import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsRankComponent } from './artists-rank.component';

describe('ArtistsRankComponent', () => {
  let component: ArtistsRankComponent;
  let fixture: ComponentFixture<ArtistsRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistsRankComponent]
    });
    fixture = TestBed.createComponent(ArtistsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
