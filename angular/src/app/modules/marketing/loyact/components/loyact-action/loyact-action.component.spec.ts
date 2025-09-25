import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyactActionComponent } from './loyact-action.component';

describe('LoyactActionComponent', () => {
  let component: LoyactActionComponent;
  let fixture: ComponentFixture<LoyactActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyactActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyactActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
