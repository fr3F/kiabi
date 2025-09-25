import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeInventaireComponent } from './liste-inventaire.component';

describe('ListeInventaireComponent', () => {
  let component: ListeInventaireComponent;
  let fixture: ComponentFixture<ListeInventaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeInventaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeInventaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
