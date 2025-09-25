import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyParamReglementComponent } from './modify-param-reglement.component';

describe('ModifyParamReglementComponent', () => {
  let component: ModifyParamReglementComponent;
  let fixture: ComponentFixture<ModifyParamReglementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyParamReglementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyParamReglementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
