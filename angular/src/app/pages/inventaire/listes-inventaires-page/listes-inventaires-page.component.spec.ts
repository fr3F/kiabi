import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListesInventairesPageComponent } from './listes-inventaires-page.component';

describe('ListesInventairesPageComponent', () => {
  let component: ListesInventairesPageComponent;
  let fixture: ComponentFixture<ListesInventairesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListesInventairesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListesInventairesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
