import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticleOffertComponent } from './detail-article-offert.component';

describe('DetailArticleOffertComponent', () => {
  let component: DetailArticleOffertComponent;
  let fixture: ComponentFixture<DetailArticleOffertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailArticleOffertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailArticleOffertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
