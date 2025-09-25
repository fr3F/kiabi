import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLogCaisseComponent } from './form-log-caisse.component';

describe('FormLogCaisseComponent', () => {
  let component: FormLogCaisseComponent;
  let fixture: ComponentFixture<FormLogCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormLogCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLogCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
