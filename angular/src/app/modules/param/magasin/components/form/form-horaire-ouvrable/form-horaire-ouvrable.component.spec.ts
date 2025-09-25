import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHoraireOuvrableComponent } from './form-horaire-ouvrable.component';

describe('FormHoraireOuvrableComponent', () => {
  let component: FormHoraireOuvrableComponent;
  let fixture: ComponentFixture<FormHoraireOuvrableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHoraireOuvrableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHoraireOuvrableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
