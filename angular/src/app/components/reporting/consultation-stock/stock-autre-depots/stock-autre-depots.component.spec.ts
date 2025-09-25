import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAutreDepotsComponent } from './stock-autre-depots.component';

describe('StockAutreDepotsComponent', () => {
  let component: StockAutreDepotsComponent;
  let fixture: ComponentFixture<StockAutreDepotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAutreDepotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAutreDepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
