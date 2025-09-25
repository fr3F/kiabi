import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMontantArticleOffertComponent } from './list-montant-article-offert.component';

describe('ListMontantArticleOffertComponent', () => {
  let component: ListMontantArticleOffertComponent;
  let fixture: ComponentFixture<ListMontantArticleOffertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMontantArticleOffertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMontantArticleOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
