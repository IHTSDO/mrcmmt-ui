import { TestBed } from '@angular/core/testing';

import { AuthoringService } from './authoring.service';

describe('AuthoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthoringService = TestBed.get(AuthoringService);
    expect(service).toBeTruthy();
  });
});
