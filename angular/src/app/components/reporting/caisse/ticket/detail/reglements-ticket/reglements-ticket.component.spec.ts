import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementsTicketComponent } from './reglements-ticket.component';

describe('ReglementsTicketComponent', () => {
  let component: ReglementsTicketComponent;
  let fixture: ComponentFixture<ReglementsTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReglementsTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglementsTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
