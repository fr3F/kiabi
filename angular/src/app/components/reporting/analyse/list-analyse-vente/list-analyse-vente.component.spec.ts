import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnalyseVenteComponent } from './list-analyse-vente.component';

describe('ListAnalyseVenteComponent', () => {
  let component: ListAnalyseVenteComponent;
  let fixture: ComponentFixture<ListAnalyseVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAnalyseVenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnalyseVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
