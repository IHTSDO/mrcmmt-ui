import { TestBed } from '@angular/core/testing';

import { AttributeService } from './attribute.service';

describe('AttributeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttributeService = TestBed.get(AttributeService);
    expect(service).toBeTruthy();
  });
});
