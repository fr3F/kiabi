import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInventairesPageComponent } from './details-inventaires-page.component';

describe('DetailsInventairesPageComponent', () => {
  let component: DetailsInventairesPageComponent;
  let fixture: ComponentFixture<DetailsInventairesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsInventairesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsInventairesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
