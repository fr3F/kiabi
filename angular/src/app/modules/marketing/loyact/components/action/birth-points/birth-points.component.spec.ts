import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthPointsComponent } from './birth-points.component';

describe('BirthPointsComponent', () => {
  let component: BirthPointsComponent;
  let fixture: ComponentFixture<BirthPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirthPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
