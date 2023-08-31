import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstActComponent } from './first-act.component';

describe('FirstActComponent', () => {
  let component: FirstActComponent;
  let fixture: ComponentFixture<FirstActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstActComponent]
    });
    fixture = TestBed.createComponent(FirstActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
