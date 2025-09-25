import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingClientVipPageComponent } from './reporting-client-vip-page.component';

describe('ReportingClientVipPageComponent', () => {
  let component: ReportingClientVipPageComponent;
  let fixture: ComponentFixture<ReportingClientVipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingClientVipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingClientVipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
