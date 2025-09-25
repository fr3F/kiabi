import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiverCarteComponent } from './activer-carte.component';

describe('ActiverCarteComponent', () => {
  let component: ActiverCarteComponent;
  let fixture: ComponentFixture<ActiverCarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiverCarteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiverCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
