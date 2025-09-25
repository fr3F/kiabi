import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultationStockComponent } from './form-consultation-stock.component';

describe('FormConsultationStockComponent', () => {
  let component: FormConsultationStockComponent;
  let fixture: ComponentFixture<FormConsultationStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConsultationStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConsultationStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
