import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImportBarcodeComponent } from './form-import-barcode.component';

describe('FormImportBarcodeComponent', () => {
  let component: FormImportBarcodeComponent;
  let fixture: ComponentFixture<FormImportBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormImportBarcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImportBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
