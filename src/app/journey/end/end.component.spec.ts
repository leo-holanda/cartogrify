import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndComponent } from './end.component';

describe('EndComponent', () => {
  let component: EndComponent;
  let fixture: ComponentFixture<EndComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EndComponent]
    });
    fixture = TestBed.createComponent(EndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
