import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSynchroComponent } from './control-synchro.component';

describe('ControlSynchroComponent', () => {
  let component: ControlSynchroComponent;
  let fixture: ComponentFixture<ControlSynchroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlSynchroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSynchroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
