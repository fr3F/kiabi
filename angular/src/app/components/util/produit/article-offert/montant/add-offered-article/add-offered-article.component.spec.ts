import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferedArticleComponent } from './add-offered-article.component';

describe('AddOfferedArticleComponent', () => {
  let component: AddOfferedArticleComponent;
  let fixture: ComponentFixture<AddOfferedArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfferedArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferedArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
