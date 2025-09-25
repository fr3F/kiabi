import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockWithoutGammesComponent } from './stock-without-gammes.component';

describe('StockWithoutGammesComponent', () => {
  let component: StockWithoutGammesComponent;
  let fixture: ComponentFixture<StockWithoutGammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockWithoutGammesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockWithoutGammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
