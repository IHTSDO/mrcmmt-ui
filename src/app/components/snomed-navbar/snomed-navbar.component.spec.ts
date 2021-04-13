import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedNavbarComponent } from './snomed-navbar.component';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SnomedNavbarComponent', () => {
    let component: SnomedNavbarComponent;
    let fixture: ComponentFixture<SnomedNavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserDynamicTestingModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot()
            ],
            providers: [
                CustomOrderPipe
            ],
            declarations: [
                SnomedNavbarComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnomedNavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
