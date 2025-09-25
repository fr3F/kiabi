import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueConsoComponent } from './historique-conso.component';

describe('HistoriqueConsoComponent', () => {
  let component: HistoriqueConsoComponent;
  let fixture: ComponentFixture<HistoriqueConsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueConsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
