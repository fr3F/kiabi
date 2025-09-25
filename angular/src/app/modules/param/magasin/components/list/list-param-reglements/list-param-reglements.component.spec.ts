import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParamReglementsComponent } from './list-param-reglements.component';

describe('ListParamReglementsComponent', () => {
  let component: ListParamReglementsComponent;
  let fixture: ComponentFixture<ListParamReglementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParamReglementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListParamReglementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
