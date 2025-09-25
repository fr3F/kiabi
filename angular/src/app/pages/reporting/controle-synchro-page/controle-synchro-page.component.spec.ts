import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleSynchroPageComponent } from './controle-synchro-page.component';

describe('ControleSynchroPageComponent', () => {
  let component: ControleSynchroPageComponent;
  let fixture: ComponentFixture<ControleSynchroPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControleSynchroPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleSynchroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
