import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModePaiementComponent } from './list-mode-paiement.component';

describe('ListModePaiementComponent', () => {
  let component: ListModePaiementComponent;
  let fixture: ComponentFixture<ListModePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModePaiementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
