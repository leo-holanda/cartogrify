import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthActComponent } from './fourth-act.component';

describe('FourthActComponent', () => {
  let component: FourthActComponent;
  let fixture: ComponentFixture<FourthActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FourthActComponent]
    });
    fixture = TestBed.createComponent(FourthActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
