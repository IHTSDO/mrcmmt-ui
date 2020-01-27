import { TestBed } from '@angular/core/testing';

import { BranchingService } from './branching.service';

describe('BranchingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchingService = TestBed.get(BranchingService);
    expect(service).toBeTruthy();
  });
});
