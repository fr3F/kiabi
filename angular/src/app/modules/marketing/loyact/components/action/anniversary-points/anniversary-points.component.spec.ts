import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnniversaryPointsComponent } from './anniversary-points.component';

describe('AnniversaryPointsComponent', () => {
  let component: AnniversaryPointsComponent;
  let fixture: ComponentFixture<AnniversaryPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnniversaryPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnniversaryPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
