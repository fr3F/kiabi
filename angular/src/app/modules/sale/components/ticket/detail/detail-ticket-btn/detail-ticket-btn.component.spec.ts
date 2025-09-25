import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketBtnComponent } from './detail-ticket-btn.component';

describe('DetailTicketBtnComponent', () => {
  let component: DetailTicketBtnComponent;
  let fixture: ComponentFixture<DetailTicketBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTicketBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTicketBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
