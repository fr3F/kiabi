import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTicketProduitComponent } from './article-ticket-produit.component';

describe('ArticleTicketProduitComponent', () => {
  let component: ArticleTicketProduitComponent;
  let fixture: ComponentFixture<ArticleTicketProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleTicketProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleTicketProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
