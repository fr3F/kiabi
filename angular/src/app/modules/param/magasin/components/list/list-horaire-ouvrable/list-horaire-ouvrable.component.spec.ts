import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHoraireOuvrableComponent } from './list-horaire-ouvrable.component';

describe('ListHoraireOuvrableComponent', () => {
  let component: ListHoraireOuvrableComponent;
  let fixture: ComponentFixture<ListHoraireOuvrableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHoraireOuvrableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHoraireOuvrableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
