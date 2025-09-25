import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteVipModalComponent } from './carte-vip-modal.component';

describe('CarteVipModalComponent', () => {
  let component: CarteVipModalComponent;
  let fixture: ComponentFixture<CarteVipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteVipModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteVipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
