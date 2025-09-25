import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SommaireReglementComponent } from './sommaire-reglement.component';

describe('SommaireReglementComponent', () => {
  let component: SommaireReglementComponent;
  let fixture: ComponentFixture<SommaireReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SommaireReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SommaireReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
