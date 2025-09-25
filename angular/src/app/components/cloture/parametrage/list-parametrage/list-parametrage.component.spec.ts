import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParametrageComponent } from './list-parametrage.component';

describe('ListParametrageComponent', () => {
  let component: ListParametrageComponent;
  let fixture: ComponentFixture<ListParametrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParametrageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListParametrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
