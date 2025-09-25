import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyTicketComponent } from './loyalty-ticket.component';

describe('LoyaltyTicketComponent', () => {
  let component: LoyaltyTicketComponent;
  let fixture: ComponentFixture<LoyaltyTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
