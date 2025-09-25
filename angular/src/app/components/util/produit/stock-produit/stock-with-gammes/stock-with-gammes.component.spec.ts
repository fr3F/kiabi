import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockWithGammesComponent } from './stock-with-gammes.component';

describe('StockWithGammesComponent', () => {
  let component: StockWithGammesComponent;
  let fixture: ComponentFixture<StockWithGammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockWithGammesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockWithGammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
