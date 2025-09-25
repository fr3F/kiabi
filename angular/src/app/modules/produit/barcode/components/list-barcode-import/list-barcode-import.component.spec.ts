import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBarcodeImportComponent } from './list-barcode-import.component';

describe('ListBarcodeImportComponent', () => {
  let component: ListBarcodeImportComponent;
  let fixture: ComponentFixture<ListBarcodeImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBarcodeImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBarcodeImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
