import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBlockingComponent } from './card-blocking.component';

describe('CardBlockingComponent', () => {
  let component: CardBlockingComponent;
  let fixture: ComponentFixture<CardBlockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardBlockingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBlockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
