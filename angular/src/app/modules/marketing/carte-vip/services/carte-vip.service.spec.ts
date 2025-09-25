import { TestBed } from '@angular/core/testing';

import { CarteVipService } from './carte-vip.service';

describe('CarteVipService', () => {
  let service: CarteVipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarteVipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
