import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMagasinPageComponent } from './form-magasin-page.component';

describe('FormMagasinPageComponent', () => {
  let component: FormMagasinPageComponent;
  let fixture: ComponentFixture<FormMagasinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMagasinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMagasinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
