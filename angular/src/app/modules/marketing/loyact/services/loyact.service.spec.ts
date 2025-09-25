import { TestBed } from '@angular/core/testing';

import { LoyactService } from './loyact.service';

describe('LoyactService', () => {
  let service: LoyactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
