import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthoringService } from './authoring.service';

describe('AuthoringService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthoringService]
    }));

    it('should be created', () => {
        const service: AuthoringService = TestBed.get(AuthoringService);
        expect(service).toBeTruthy();
    });
});
