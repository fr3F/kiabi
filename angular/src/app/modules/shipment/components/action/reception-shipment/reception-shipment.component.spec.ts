import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionShipmentComponent } from './reception-shipment.component';

describe('ReceptionShipmentComponent', () => {
  let component: ReceptionShipmentComponent;
  let fixture: ComponentFixture<ReceptionShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
