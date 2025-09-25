import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingClientVipComponent } from './reporting-client-vip.component';

describe('ReportingClientVipComponent', () => {
  let component: ReportingClientVipComponent;
  let fixture: ComponentFixture<ReportingClientVipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingClientVipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingClientVipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
