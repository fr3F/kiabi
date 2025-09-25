import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeProduitComponent } from './barcode-produit.component';

describe('BarcodeProduitComponent', () => {
  let component: BarcodeProduitComponent;
  let fixture: ComponentFixture<BarcodeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
