import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreClsComponent } from './filtre-cls.component';

describe('FiltreClsComponent', () => {
  let component: FiltreClsComponent;
  let fixture: ComponentFixture<FiltreClsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltreClsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltreClsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
