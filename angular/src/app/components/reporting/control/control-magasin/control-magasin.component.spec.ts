import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMagasinComponent } from './control-magasin.component';

describe('ControlMagasinComponent', () => {
  let component: ControlMagasinComponent;
  let fixture: ComponentFixture<ControlMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
