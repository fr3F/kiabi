import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedArticlesListComponent } from './offered-articles-list.component';

describe('OfferedArticlesListComponent', () => {
  let component: OfferedArticlesListComponent;
  let fixture: ComponentFixture<OfferedArticlesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedArticlesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedArticlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
