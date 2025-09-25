import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProduitArticleOffertComponent } from './list-produit-article-offert.component';

describe('ListProduitArticleOffertComponent', () => {
  let component: ListProduitArticleOffertComponent;
  let fixture: ComponentFixture<ListProduitArticleOffertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProduitArticleOffertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProduitArticleOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
