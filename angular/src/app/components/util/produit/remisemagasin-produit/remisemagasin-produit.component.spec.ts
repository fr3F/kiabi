import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemisemagasinProduitComponent } from './remisemagasin-produit.component';

describe('RemisemagasinProduitComponent', () => {
  let component: RemisemagasinProduitComponent;
  let fixture: ComponentFixture<RemisemagasinProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemisemagasinProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemisemagasinProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
