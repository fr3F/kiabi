import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMontantArticleOffertComponent } from './form-montant-article-offert.component';

describe('FormMontantArticleOffertComponent', () => {
  let component: FormMontantArticleOffertComponent;
  let fixture: ComponentFixture<FormMontantArticleOffertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMontantArticleOffertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMontantArticleOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
