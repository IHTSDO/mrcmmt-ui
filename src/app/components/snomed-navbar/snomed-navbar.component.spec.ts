import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedNavbarComponent } from './snomed-navbar.component';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { BranchPathPipe } from '../../pipes/branch-path.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('SnomedNavbarComponent', () => {
    let component: SnomedNavbarComponent;
    let fixture: ComponentFixture<SnomedNavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserDynamicTestingModule
            ],
            providers: [
                CustomOrderPipe
            ],
            declarations: [
                SnomedNavbarComponent,
                BranchPathPipe
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
