import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationStocksComponent } from './consultation-stocks.component';

describe('ConsultationStocksComponent', () => {
  let component: ConsultationStocksComponent;
  let fixture: ComponentFixture<ConsultationStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationStocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
