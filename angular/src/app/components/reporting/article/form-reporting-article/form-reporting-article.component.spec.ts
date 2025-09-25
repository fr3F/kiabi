import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportingArticleComponent } from './form-reporting-article.component';

describe('FormReportingArticleComponent', () => {
  let component: FormReportingArticleComponent;
  let fixture: ComponentFixture<FormReportingArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormReportingArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportingArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
