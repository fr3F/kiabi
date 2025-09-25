import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEncaissementCaisseComponent } from './list-encaissement-caisse.component';

describe('ListEncaissementCaisseComponent', () => {
  let component: ListEncaissementCaisseComponent;
  let fixture: ComponentFixture<ListEncaissementCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEncaissementCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEncaissementCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
