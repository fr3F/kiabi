import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapReportingTicketComponent } from './recap-reporting-ticket.component';

describe('RecapReportingTicketComponent', () => {
  let component: RecapReportingTicketComponent;
  let fixture: ComponentFixture<RecapReportingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecapReportingTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapReportingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
