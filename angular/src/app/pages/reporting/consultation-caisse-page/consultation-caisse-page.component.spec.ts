import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationCaissePageComponent } from './consultation-caisse-page.component';

describe('ConsultationCaissePageComponent', () => {
  let component: ConsultationCaissePageComponent;
  let fixture: ComponentFixture<ConsultationCaissePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationCaissePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationCaissePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
