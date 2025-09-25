import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTransfertSageComponent } from './form-transfert-sage.component';

describe('FormTransfertSageComponent', () => {
  let component: FormTransfertSageComponent;
  let fixture: ComponentFixture<FormTransfertSageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTransfertSageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTransfertSageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
