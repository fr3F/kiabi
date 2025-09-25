import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleOffertProduitComponent } from './article-offert-produit.component';

describe('ArticleOffertProduitComponent', () => {
  let component: ArticleOffertProduitComponent;
  let fixture: ComponentFixture<ArticleOffertProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleOffertProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleOffertProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
