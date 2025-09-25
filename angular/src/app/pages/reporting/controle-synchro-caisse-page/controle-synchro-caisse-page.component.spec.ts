import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleSynchroCaissePageComponent } from './controle-synchro-caisse-page.component';

describe('ControleSynchroCaissePageComponent', () => {
  let component: ControleSynchroCaissePageComponent;
  let fixture: ComponentFixture<ControleSynchroCaissePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControleSynchroCaissePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControleSynchroCaissePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
