import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationTicketPageComponent } from './consultation-ticket-page.component';

describe('ConsultationTicketPageComponent', () => {
  let component: ConsultationTicketPageComponent;
  let fixture: ComponentFixture<ConsultationTicketPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationTicketPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationTicketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
