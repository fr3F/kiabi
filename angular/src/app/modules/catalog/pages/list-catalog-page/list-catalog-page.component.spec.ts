import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogPageComponent } from './list-catalog-page.component';

describe('ListCatalogPageComponent', () => {
  let component: ListCatalogPageComponent;
  let fixture: ComponentFixture<ListCatalogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
