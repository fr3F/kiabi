import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTicketToRegularizeComponent } from './list-ticket-to-regularize.component';

describe('ListTicketToRegularizeComponent', () => {
  let component: ListTicketToRegularizeComponent;
  let fixture: ComponentFixture<ListTicketToRegularizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTicketToRegularizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTicketToRegularizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
