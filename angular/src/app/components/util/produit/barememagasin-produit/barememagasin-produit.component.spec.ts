import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarememagasinProduitComponent } from './barememagasin-produit.component';

describe('BarememagasinProduitComponent', () => {
  let component: BarememagasinProduitComponent;
  let fixture: ComponentFixture<BarememagasinProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarememagasinProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarememagasinProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
