import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifmagasinProduitComponent } from './tarifmagasin-produit.component';

describe('TarifmagasinProduitComponent', () => {
  let component: TarifmagasinProduitComponent;
  let fixture: ComponentFixture<TarifmagasinProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarifmagasinProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifmagasinProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
