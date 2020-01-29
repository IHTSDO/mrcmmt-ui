import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbBarComponent } from './breadcrumb-bar.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';

describe('BreadcrumbBarComponent', () => {
    let component: BreadcrumbBarComponent;
    let fixture: ComponentFixture<BreadcrumbBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserDynamicTestingModule,
                RouterTestingModule,
                HttpClientTestingModule
            ],
            declarations: [
                BreadcrumbBarComponent
            ],
            providers: [
                CustomOrderPipe
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BreadcrumbBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
