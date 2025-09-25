import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModePaiementListPageComponent } from './mode-paiement-list-page.component';

describe('ModePaiementListPageComponent', () => {
  let component: ModePaiementListPageComponent;
  let fixture: ComponentFixture<ModePaiementListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModePaiementListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModePaiementListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
