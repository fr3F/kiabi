import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormPageComponent } from './base-form-page.component';

describe('BaseFormPageComponent', () => {
  let component: BaseFormPageComponent;
  let fixture: ComponentFixture<BaseFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
