import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquesParametrageComponent } from './historiques-parametrage.component';

describe('HistoriquesParametrageComponent', () => {
  let component: HistoriquesParametrageComponent;
  let fixture: ComponentFixture<HistoriquesParametrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriquesParametrageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriquesParametrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
