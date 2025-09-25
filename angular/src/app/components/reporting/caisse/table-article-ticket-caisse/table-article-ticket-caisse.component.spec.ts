import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableArticleTicketCaisseComponent } from './table-article-ticket-caisse.component';

describe('TableArticleTicketCaisseComponent', () => {
  let component: TableArticleTicketCaisseComponent;
  let fixture: ComponentFixture<TableArticleTicketCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableArticleTicketCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableArticleTicketCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
