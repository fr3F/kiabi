import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMonnaieComponent } from './form-monnaie.component';

describe('FormMonnaieComponent', () => {
  let component: FormMonnaieComponent;
  let fixture: ComponentFixture<FormMonnaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMonnaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMonnaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
