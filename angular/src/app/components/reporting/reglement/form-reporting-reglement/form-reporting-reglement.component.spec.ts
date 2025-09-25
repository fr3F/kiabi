import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportingReglementComponent } from './form-reporting-reglement.component';

describe('FormReportingReglementComponent', () => {
  let component: FormReportingReglementComponent;
  let fixture: ComponentFixture<FormReportingReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormReportingReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportingReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
