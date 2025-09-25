import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesTicketComponent } from './articles-ticket.component';

describe('ArticlesTicketComponent', () => {
  let component: ArticlesTicketComponent;
  let fixture: ComponentFixture<ArticlesTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
