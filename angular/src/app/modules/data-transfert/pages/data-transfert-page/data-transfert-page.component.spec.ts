import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTransfertPageComponent } from './data-transfert-page.component';

describe('DataTransfertPageComponent', () => {
  let component: DataTransfertPageComponent;
  let fixture: ComponentFixture<DataTransfertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTransfertPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTransfertPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
