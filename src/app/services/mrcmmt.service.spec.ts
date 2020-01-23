import { TestBed } from '@angular/core/testing';

import { MrcmmtService } from './mrcmmt.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MrcmmtService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            BrowserDynamicTestingModule,
            RouterTestingModule
        ]
    }));

    it('should be created', () => {
        const service: MrcmmtService = TestBed.get(MrcmmtService);
        expect(service).toBeTruthy();
    });
});
