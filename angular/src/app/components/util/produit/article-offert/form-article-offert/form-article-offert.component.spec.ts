import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArticleOffertComponent } from './form-article-offert.component';

describe('FormArticleOffertComponent', () => {
  let component: FormArticleOffertComponent;
  let fixture: ComponentFixture<FormArticleOffertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormArticleOffertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormArticleOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
