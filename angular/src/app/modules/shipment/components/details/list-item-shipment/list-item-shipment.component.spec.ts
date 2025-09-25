import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemShipmentComponent } from './list-item-shipment.component';

describe('ListItemShipmentComponent', () => {
  let component: ListItemShipmentComponent;
  let fixture: ComponentFixture<ListItemShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
