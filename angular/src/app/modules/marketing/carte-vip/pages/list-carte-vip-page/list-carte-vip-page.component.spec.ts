import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarteVipPageComponent } from './list-carte-vip-page.component';

describe('ListCarteVipPageComponent', () => {
  let component: ListCarteVipPageComponent;
  let fixture: ComponentFixture<ListCarteVipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCarteVipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarteVipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
