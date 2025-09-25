import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClientVipComponent } from './form-client-vip.component';

describe('FormClientVipComponent', () => {
  let component: FormClientVipComponent;
  let fixture: ComponentFixture<FormClientVipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormClientVipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClientVipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
