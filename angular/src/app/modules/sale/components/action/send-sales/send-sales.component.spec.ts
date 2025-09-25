import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSalesComponent } from './send-sales.component';

describe('SendSalesComponent', () => {
  let component: SendSalesComponent;
  let fixture: ComponentFixture<SendSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
