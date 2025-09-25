import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailShipmentPageComponent } from './detail-shipment-page.component';

describe('DetailShipmentPageComponent', () => {
  let component: DetailShipmentPageComponent;
  let fixture: ComponentFixture<DetailShipmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailShipmentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailShipmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
