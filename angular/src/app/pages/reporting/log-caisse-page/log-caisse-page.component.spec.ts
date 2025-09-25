import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCaissePageComponent } from './log-caisse-page.component';

describe('LogCaissePageComponent', () => {
  let component: LogCaissePageComponent;
  let fixture: ComponentFixture<LogCaissePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogCaissePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogCaissePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
