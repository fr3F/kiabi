import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationCaisseCodePageComponent } from './consultation-caisse-code-page.component';

describe('ConsultationCaisseCodePageComponent', () => {
  let component: ConsultationCaisseCodePageComponent;
  let fixture: ComponentFixture<ConsultationCaisseCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationCaisseCodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationCaisseCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
