import { TestBed } from '@angular/core/testing';

import { DomainService } from './domain.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DomainService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            BrowserDynamicTestingModule,
            RouterTestingModule
        ]
    }));

    it('should be created', () => {
        const service: DomainService = TestBed.get(DomainService);
        expect(service).toBeTruthy();
    });
});
