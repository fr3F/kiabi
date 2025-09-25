import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketCaisseComponent } from './list-ticket-caisse.component';

describe('ListTicketCaisseComponent', () => {
  let component: ListTicketCaisseComponent;
  let fixture: ComponentFixture<ListTicketCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
