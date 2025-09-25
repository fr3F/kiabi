import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingOperationComponent } from './marketing-operation.component';

describe('MarketingOperationComponent', () => {
  let component: MarketingOperationComponent;
  let fixture: ComponentFixture<MarketingOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
