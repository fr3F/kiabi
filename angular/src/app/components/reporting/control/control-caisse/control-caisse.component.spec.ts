import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCaisseComponent } from './control-caisse.component';

describe('ControlCaisseComponent', () => {
  let component: ControlCaisseComponent;
  let fixture: ComponentFixture<ControlCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
