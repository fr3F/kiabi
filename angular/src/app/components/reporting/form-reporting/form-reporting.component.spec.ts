import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportingComponent } from './form-reporting.component';

describe('FormReportingComponent', () => {
  let component: FormReportingComponent;
  let fixture: ComponentFixture<FormReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
