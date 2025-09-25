import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidationEncaissementComponent } from './form-validation-encaissement.component';

describe('FormValidationEncaissementComponent', () => {
  let component: FormValidationEncaissementComponent;
  let fixture: ComponentFixture<FormValidationEncaissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormValidationEncaissementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormValidationEncaissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
