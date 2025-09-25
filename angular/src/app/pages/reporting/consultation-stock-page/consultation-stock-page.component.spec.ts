import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationStockPageComponent } from './consultation-stock-page.component';

describe('ConsultationStockPageComponent', () => {
  let component: ConsultationStockPageComponent;
  let fixture: ComponentFixture<ConsultationStockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationStockPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationStockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
