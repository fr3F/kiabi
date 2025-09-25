import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShipmentPageComponent } from './list-shipment-page.component';

describe('ListShipmentPageComponent', () => {
  let component: ListShipmentPageComponent;
  let fixture: ComponentFixture<ListShipmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListShipmentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListShipmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
