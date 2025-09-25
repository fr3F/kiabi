import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPeriodeComponent } from './form-periode.component';

describe('FormPeriodeComponent', () => {
  let component: FormPeriodeComponent;
  let fixture: ComponentFixture<FormPeriodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPeriodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPeriodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
