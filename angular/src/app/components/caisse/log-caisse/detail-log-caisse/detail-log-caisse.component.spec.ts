import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLogCaisseComponent } from './detail-log-caisse.component';

describe('DetailLogCaisseComponent', () => {
  let component: DetailLogCaisseComponent;
  let fixture: ComponentFixture<DetailLogCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailLogCaisseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLogCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
