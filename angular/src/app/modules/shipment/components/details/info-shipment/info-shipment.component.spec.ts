import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoShipmentComponent } from './info-shipment.component';

describe('InfoShipmentComponent', () => {
  let component: InfoShipmentComponent;
  let fixture: ComponentFixture<InfoShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
