import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingArticleTicketComponent } from './reporting-article-ticket.component';

describe('ReportingArticleTicketComponent', () => {
  let component: ReportingArticleTicketComponent;
  let fixture: ComponentFixture<ReportingArticleTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingArticleTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingArticleTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
