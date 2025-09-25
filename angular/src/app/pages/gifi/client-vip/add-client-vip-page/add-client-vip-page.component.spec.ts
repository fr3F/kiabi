import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientVipPageComponent } from './add-client-vip-page.component';

describe('AddClientVipPageComponent', () => {
  let component: AddClientVipPageComponent;
  let fixture: ComponentFixture<AddClientVipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientVipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientVipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
