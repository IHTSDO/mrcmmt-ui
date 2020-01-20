import { TestBed } from '@angular/core/testing';

import { RangeService } from './range.service';

describe('RangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RangeService = TestBed.get(RangeService);
    expect(service).toBeTruthy();
  });
});
