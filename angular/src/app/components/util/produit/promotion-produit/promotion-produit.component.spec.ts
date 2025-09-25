import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionProduitComponent } from './promotion-produit.component';

describe('PromotionProduitComponent', () => {
  let component: PromotionProduitComponent;
  let fixture: ComponentFixture<PromotionProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
