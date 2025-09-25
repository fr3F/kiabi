import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientVipComponent } from './list-client-vip.component';

describe('ListClientVipComponent', () => {
  let component: ListClientVipComponent;
  let fixture: ComponentFixture<ListClientVipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClientVipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientVipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
