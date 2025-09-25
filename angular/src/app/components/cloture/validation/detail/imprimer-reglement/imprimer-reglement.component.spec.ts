import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimerReglementComponent } from './imprimer-reglement.component';

describe('ImprimerReglementComponent', () => {
  let component: ImprimerReglementComponent;
  let fixture: ComponentFixture<ImprimerReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprimerReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimerReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
