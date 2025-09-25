import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListARegulariserComponent } from './list-aregulariser.component';

describe('ListARegulariserComponent', () => {
  let component: ListARegulariserComponent;
  let fixture: ComponentFixture<ListARegulariserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListARegulariserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListARegulariserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
