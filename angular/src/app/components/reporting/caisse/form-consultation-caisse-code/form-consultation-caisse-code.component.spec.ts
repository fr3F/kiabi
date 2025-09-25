import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultationCaisseCodeComponent } from './form-consultation-caisse-code.component';

describe('FormConsultationCaisseCodeComponent', () => {
  let component: FormConsultationCaisseCodeComponent;
  let fixture: ComponentFixture<FormConsultationCaisseCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConsultationCaisseCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConsultationCaisseCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
