import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMagasinComponent } from './list-magasin.component';

describe('ListMagasinComponent', () => {
  let component: ListMagasinComponent;
  let fixture: ComponentFixture<ListMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
