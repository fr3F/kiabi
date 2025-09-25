import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseVentePageComponent } from './analyse-vente-page.component';

describe('AnalyseVentePageComponent', () => {
  let component: AnalyseVentePageComponent;
  let fixture: ComponentFixture<AnalyseVentePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseVentePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseVentePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
