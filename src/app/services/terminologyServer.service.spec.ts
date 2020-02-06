import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TerminologyServerService } from './terminologyServer.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('TerminologyServerService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            BrowserDynamicTestingModule,
            RouterTestingModule
        ],
        providers: [TerminologyServerService]
    }));

    it('should be created', () => {
        const service: TerminologyServerService = TestBed.get(TerminologyServerService);
        expect(service).toBeTruthy();
    });
});
