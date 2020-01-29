import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';

import { EditService } from './edit.service';

describe('editService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule
        ],
        providers: [
                CustomOrderPipe
        ]
    }));

    it('should be created', () => {
        const service: EditService = TestBed.get(EditService);
        expect(service).toBeTruthy();
    });
});
