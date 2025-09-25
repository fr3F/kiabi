import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConsultationStockComponent } from './list-consultation-stock.component';

describe('ListConsultationStockComponent', () => {
  let component: ListConsultationStockComponent;
  let fixture: ComponentFixture<ListConsultationStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConsultationStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConsultationStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
