import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlCaisseComponent } from './form-control-caisse.component';

describe('FormControlCaisseComponent', () => {
  let component: FormControlCaisseComponent;
  let fixture: ComponentFixture<FormControlCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormControlCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
