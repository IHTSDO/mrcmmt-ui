import { TestBed } from '@angular/core/testing';
import { UrlParamsService } from './url-params.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UrlParamsService', () => {
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
        const service: UrlParamsService = TestBed.get(UrlParamsService);
        expect(service).toBeTruthy();
    });
});
