import { TestBed } from '@angular/core/testing';

import { MrcmmtService } from './mrcmmt.service';

describe('MrcmmtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrcmmtService = TestBed.get(MrcmmtService);
    expect(service).toBeTruthy();
  });
});
