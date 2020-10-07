import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { SnomedNavbarComponent } from './components/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/snomed-footer/snomed-footer.component';
import { BreadcrumbBarComponent } from './components/breadcrumb-bar/breadcrumb-bar.component';
import { DomainPanelComponent } from './components/domain-panel/domain-panel.component';
import { ApplicableAttributesPanelComponent } from './components/applicable-attributes-panel/applicable-attributes-panel.component';
import { AttributeRangePanelComponent } from './components/attribute-range-panel/attribute-range-panel.component';
import { DuplicateFilterPipe } from './pipes/duplicate-filter.pipe';
import { DomainMatchPipe } from './pipes/domain-match.pipe';
import { InheritedDomainMatchPipe } from './pipes/inherited-domain-match.pipe';
import { TextMatchPipe } from './pipes/text-match.pipe';
import { AlphabeticalPipe } from './pipes/alphabetical.pipe';
import { TopLevelDomainPipe } from './pipes/top-level-domain.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AppRoutingModule } from './app-routing.module';
import { CustomOrderPipe } from './pipes/custom-order.pipe';
import { ModalComponent } from './components/modal/modal.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                BrowserDynamicTestingModule,
                AppRoutingModule,
                NgbTypeaheadModule
            ],
            providers: [
                CustomOrderPipe,
                {provide: APP_BASE_HREF, useValue : '/mrcm/' }
            ],
            declarations: [
                AppComponent,
                SnomedNavbarComponent,
                SnomedFooterComponent,
                BreadcrumbBarComponent,
                DomainPanelComponent,
                ApplicableAttributesPanelComponent,
                AttributeRangePanelComponent,
                ModalComponent,
                DuplicateFilterPipe,
                DomainMatchPipe,
                InheritedDomainMatchPipe,
                TextMatchPipe,
                AlphabeticalPipe,
                TopLevelDomainPipe
            ]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
