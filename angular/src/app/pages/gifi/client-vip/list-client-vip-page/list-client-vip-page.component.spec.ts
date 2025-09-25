import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientVipPageComponent } from './list-client-vip-page.component';

describe('ListClientVipPageComponent', () => {
  let component: ListClientVipPageComponent;
  let fixture: ComponentFixture<ListClientVipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListClientVipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientVipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
