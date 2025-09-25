import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalyseVenteComponent } from './form-analyse-vente.component';

describe('FormAnalyseVenteComponent', () => {
  let component: FormAnalyseVenteComponent;
  let fixture: ComponentFixture<FormAnalyseVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAnalyseVenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalyseVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
