import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondActComponent } from './second-act.component';

describe('SecondActComponent', () => {
  let component: SecondActComponent;
  let fixture: ComponentFixture<SecondActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecondActComponent]
    });
    fixture = TestBed.createComponent(SecondActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
