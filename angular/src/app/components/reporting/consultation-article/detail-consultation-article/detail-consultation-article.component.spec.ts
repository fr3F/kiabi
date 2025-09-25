import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsultationArticleComponent } from './detail-consultation-article.component';

describe('DetailConsultationArticleComponent', () => {
  let component: DetailConsultationArticleComponent;
  let fixture: ComponentFixture<DetailConsultationArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConsultationArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConsultationArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
