import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageVipPageComponent } from './parametrage-vip-page.component';

describe('ParametrageVipPageComponent', () => {
  let component: ParametrageVipPageComponent;
  let fixture: ComponentFixture<ParametrageVipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrageVipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrageVipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
