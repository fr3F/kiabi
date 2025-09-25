import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultationArticleComponent } from './form-consultation-article.component';

describe('FormConsultationArticleComponent', () => {
  let component: FormConsultationArticleComponent;
  let fixture: ComponentFixture<FormConsultationArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormConsultationArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConsultationArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
