import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInventaireComponent } from './details-inventaire.component';

describe('DetailsInventaireComponent', () => {
  let component: DetailsInventaireComponent;
  let fixture: ComponentFixture<DetailsInventaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsInventaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
