import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPeriode2Component } from './form-periode2.component';

describe('FormPeriode2Component', () => {
  let component: FormPeriode2Component;
  let fixture: ComponentFixture<FormPeriode2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPeriode2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPeriode2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
