import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMonnaieMagasinComponent } from './list-monnaie-magasin.component';

describe('ListMonnaieMagasinComponent', () => {
  let component: ListMonnaieMagasinComponent;
  let fixture: ComponentFixture<ListMonnaieMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMonnaieMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMonnaieMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
