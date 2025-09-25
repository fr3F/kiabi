import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarteVipComponent } from './list-carte-vip.component';

describe('ListCarteVipComponent', () => {
  let component: ListCarteVipComponent;
  let fixture: ComponentFixture<ListCarteVipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCarteVipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarteVipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
