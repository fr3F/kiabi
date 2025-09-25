import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAccesComponent } from './form-acces.component';

describe('FormAccesComponent', () => {
  let component: FormAccesComponent;
  let fixture: ComponentFixture<FormAccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAccesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
