import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVentesArticleComponent } from './list-ventes-article.component';

describe('ListVentesArticleComponent', () => {
  let component: ListVentesArticleComponent;
  let fixture: ComponentFixture<ListVentesArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVentesArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVentesArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
