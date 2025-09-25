import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaireProgressComponent } from './inventaire-progress.component';

describe('InventaireProgressComponent', () => {
  let component: InventaireProgressComponent;
  let fixture: ComponentFixture<InventaireProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventaireProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventaireProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
