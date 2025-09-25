import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTicketMagasinPageComponent } from './detail-ticket-magasin-page.component';

describe('DetailTicketMagasinPageComponent', () => {
  let component: DetailTicketMagasinPageComponent;
  let fixture: ComponentFixture<DetailTicketMagasinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTicketMagasinPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTicketMagasinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
