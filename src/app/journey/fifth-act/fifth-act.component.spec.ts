import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifthActComponent } from './fifth-act.component';

describe('FifthActComponent', () => {
  let component: FifthActComponent;
  let fixture: ComponentFixture<FifthActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FifthActComponent]
    });
    fixture = TestBed.createComponent(FifthActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
