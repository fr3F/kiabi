import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBilletageComponent } from './list-billetage.component';

describe('ListBilletageComponent', () => {
  let component: ListBilletageComponent;
  let fixture: ComponentFixture<ListBilletageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBilletageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBilletageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
