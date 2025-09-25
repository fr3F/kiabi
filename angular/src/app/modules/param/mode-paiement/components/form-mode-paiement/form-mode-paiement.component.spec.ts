import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModePaiementComponent } from './form-mode-paiement.component';

describe('FormModePaiementComponent', () => {
  let component: FormModePaiementComponent;
  let fixture: ComponentFixture<FormModePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormModePaiementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
