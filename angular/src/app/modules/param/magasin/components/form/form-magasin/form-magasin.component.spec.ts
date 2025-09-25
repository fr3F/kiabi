import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMagasinComponent } from './form-magasin.component';

describe('FormMagasinComponent', () => {
  let component: FormMagasinComponent;
  let fixture: ComponentFixture<FormMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
