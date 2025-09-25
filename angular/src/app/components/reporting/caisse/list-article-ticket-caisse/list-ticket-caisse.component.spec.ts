import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArticleTicketCaisseComponent } from './list-ticket-caisse.component';

describe('ListTicketCaisseComponent', () => {
  let component: ListArticleTicketCaisseComponent;
  let fixture: ComponentFixture<ListArticleTicketCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListArticleTicketCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListArticleTicketCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
