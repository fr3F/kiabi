import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeJourComponent } from './resume-jour.component';

describe('ResumeJourComponent', () => {
  let component: ResumeJourComponent;
  let fixture: ComponentFixture<ResumeJourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeJourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
