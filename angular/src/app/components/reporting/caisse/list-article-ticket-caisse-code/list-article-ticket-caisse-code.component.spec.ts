import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListArticleTicketCaisseCodeComponent } from './list-article-ticket-caisse-code.component';

describe('ListArticleTicketCaisseCodeComponent', () => {
  let component: ListArticleTicketCaisseCodeComponent;
  let fixture: ComponentFixture<ListArticleTicketCaisseCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListArticleTicketCaisseCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListArticleTicketCaisseCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
