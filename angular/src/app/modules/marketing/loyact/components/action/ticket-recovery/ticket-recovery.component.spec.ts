import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketRecoveryComponent } from './ticket-recovery.component';

describe('TicketRecoveryComponent', () => {
  let component: TicketRecoveryComponent;
  let fixture: ComponentFixture<TicketRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
