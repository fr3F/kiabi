import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultationCaisseComponent } from './form-consultation-caisse.component';

describe('FormConsultationCaisseComponent', () => {
  let component: FormConsultationCaisseComponent;
  let fixture: ComponentFixture<FormConsultationCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConsultationCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConsultationCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
