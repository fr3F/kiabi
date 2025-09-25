import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProduitComponent } from './stock-produit.component';

describe('StockProduitComponent', () => {
  let component: StockProduitComponent;
  let fixture: ComponentFixture<StockProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
