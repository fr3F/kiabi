import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquePrixProduitComponent } from './historique-prix-produit.component';

describe('HistoriquePrixProduitComponent', () => {
  let component: HistoriquePrixProduitComponent;
  let fixture: ComponentFixture<HistoriquePrixProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriquePrixProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquePrixProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
