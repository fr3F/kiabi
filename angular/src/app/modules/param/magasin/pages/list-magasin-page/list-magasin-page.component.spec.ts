import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMagasinPageComponent } from './list-magasin-page.component';

describe('ListMagasinPageComponent', () => {
  let component: ListMagasinPageComponent;
  let fixture: ComponentFixture<ListMagasinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMagasinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMagasinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
