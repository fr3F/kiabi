import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBarcodePageComponent } from './import-barcode-page.component';

describe('ImportBarcodePageComponent', () => {
  let component: ImportBarcodePageComponent;
  let fixture: ComponentFixture<ImportBarcodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBarcodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBarcodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
