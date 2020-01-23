import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TerminologyServerService } from './terminologyServer.service';

describe('TerminologyServerService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [TerminologyServerService]
    }));

    it('should be created', () => {
        const service: TerminologyServerService = TestBed.get(TerminologyServerService);
        expect(service).toBeTruthy();
    });
});
