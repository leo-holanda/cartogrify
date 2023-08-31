import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdActComponent } from './third-act.component';

describe('ThirdActComponent', () => {
  let component: ThirdActComponent;
  let fixture: ComponentFixture<ThirdActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdActComponent]
    });
    fixture = TestBed.createComponent(ThirdActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
