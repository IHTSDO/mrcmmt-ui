import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';

import { EditService } from './edit.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

describe('editService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            BrowserAnimationsModule,
            ToastrModule.forRoot()
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
