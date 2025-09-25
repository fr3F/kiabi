import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentCartonComponent } from './shipment-carton.component';

describe('ShipmentCartonComponent', () => {
  let component: ShipmentCartonComponent;
  let fixture: ComponentFixture<ShipmentCartonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentCartonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentCartonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
