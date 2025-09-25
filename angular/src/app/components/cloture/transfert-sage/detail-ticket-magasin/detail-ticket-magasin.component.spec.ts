import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketMagasinComponent } from './detail-ticket-magasin.component';

describe('DetailTicketMagasinComponent', () => {
  let component: DetailTicketMagasinComponent;
  let fixture: ComponentFixture<DetailTicketMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTicketMagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTicketMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
