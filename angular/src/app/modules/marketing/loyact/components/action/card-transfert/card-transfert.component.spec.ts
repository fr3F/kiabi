import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTransfertComponent } from './card-transfert.component';

describe('CardTransfertComponent', () => {
  let component: CardTransfertComponent;
  let fixture: ComponentFixture<CardTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTransfertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
