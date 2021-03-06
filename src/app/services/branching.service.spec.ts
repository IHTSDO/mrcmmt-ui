import { TestBed } from '@angular/core/testing';

import { BranchingService } from './branching.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('BranchingService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            BrowserDynamicTestingModule,
            RouterTestingModule
        ],
        providers: [],
        declarations: []
    }));

    it('should be created', () => {
        const service: BranchingService = TestBed.get(BranchingService);
        expect(service).toBeTruthy();
    });
});
