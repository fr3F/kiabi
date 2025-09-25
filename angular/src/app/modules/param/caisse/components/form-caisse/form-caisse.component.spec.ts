import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCaisseComponent } from './form-caisse.component';

describe('FormCaisseComponent', () => {
  let component: FormCaisseComponent;
  let fixture: ComponentFixture<FormCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
