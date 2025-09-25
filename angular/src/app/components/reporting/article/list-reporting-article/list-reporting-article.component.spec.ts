import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReportingArticleComponent } from './list-reporting-article.component';

describe('ListReportingArticleComponent', () => {
  let component: ListReportingArticleComponent;
  let fixture: ComponentFixture<ListReportingArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReportingArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReportingArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
