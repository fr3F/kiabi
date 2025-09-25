import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePackComponent } from './welcome-pack.component';

describe('WelcomePackComponent', () => {
  let component: WelcomePackComponent;
  let fixture: ComponentFixture<WelcomePackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomePackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
