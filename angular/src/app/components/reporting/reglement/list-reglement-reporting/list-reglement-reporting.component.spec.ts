import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReglementReportingComponent } from './list-reglement-reporting.component';

describe('ListReglementReportingComponent', () => {
  let component: ListReglementReportingComponent;
  let fixture: ComponentFixture<ListReglementReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReglementReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReglementReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
