import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParametrageComponent } from './form-parametrage.component';

describe('FormParametrageComponent', () => {
  let component: FormParametrageComponent;
  let fixture: ComponentFixture<FormParametrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormParametrageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormParametrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
