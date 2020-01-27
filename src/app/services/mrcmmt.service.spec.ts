import { TestBed } from '@angular/core/testing';

import { MrcmmtService } from './mrcmmt.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';

describe('MrcmmtService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            BrowserDynamicTestingModule,
            RouterTestingModule
        ],
        providers: [
            CustomOrderPipe
        ],
        declarations: []
    }));

    it('should be created', () => {
        const service: MrcmmtService = TestBed.get(MrcmmtService);
        expect(service).toBeTruthy();
    });
});
