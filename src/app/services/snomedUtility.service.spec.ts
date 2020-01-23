import { TestBed } from '@angular/core/testing';

import { SnomedUtilityService } from './snomedUtility.service';

describe('SonemedUtilityService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SnomedUtilityService = TestBed.get(SnomedUtilityService);
        expect(service).toBeTruthy();
    });
});
