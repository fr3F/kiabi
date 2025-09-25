import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingArticlePageComponent } from './reporting-article-page.component';

describe('ReportingArticlePageComponent', () => {
  let component: ReportingArticlePageComponent;
  let fixture: ComponentFixture<ReportingArticlePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingArticlePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingArticlePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
