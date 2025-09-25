import { TestBed } from '@angular/core/testing';

import { ParametrageClotureService } from './parametrage-cloture.service';

describe('ParametrageClotureService', () => {
  let service: ParametrageClotureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageClotureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
