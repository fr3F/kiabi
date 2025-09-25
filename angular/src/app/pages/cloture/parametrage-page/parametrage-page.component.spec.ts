import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametragePageComponent } from './parametrage-page.component';

describe('ParametragePageComponent', () => {
  let component: ParametragePageComponent;
  let fixture: ComponentFixture<ParametragePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametragePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametragePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
