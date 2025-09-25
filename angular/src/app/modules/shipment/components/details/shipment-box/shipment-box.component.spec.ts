import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentBoxComponent } from './shipment-box.component';

describe('ShipmentBoxComponent', () => {
  let component: ShipmentBoxComponent;
  let fixture: ComponentFixture<ShipmentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
