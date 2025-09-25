import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseListPageComponent } from './base-list-page.component';

describe('BaseListPageComponent', () => {
  let component: BaseListPageComponent;
  let fixture: ComponentFixture<BaseListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
