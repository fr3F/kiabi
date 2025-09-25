import { TestBed } from '@angular/core/testing';

import { DataTransfertService } from './data-transfert.service';

describe('DataTransfertService', () => {
  let service: DataTransfertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTransfertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
