import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEncaissementValidationComponent } from './list-encaissement-validation.component';

describe('ListEncaissementValidationComponent', () => {
  let component: ListEncaissementValidationComponent;
  let fixture: ComponentFixture<ListEncaissementValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEncaissementValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEncaissementValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
