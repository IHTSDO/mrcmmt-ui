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


describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule
            ],
            declarations: [
                AppComponent,
                SnomedNavbarComponent,
                SnomedFooterComponent,
                BreadcrumbBarComponent,
                DomainPanelComponent,
                ApplicableAttributesPanelComponent,
                AttributeRangePanelComponent,
                DuplicateFilterPipe,
                DomainMatchPipe,
                InheritedDomainMatchPipe,
                TextMatchPipe,
                AlphabeticalPipe,
                TopLevelDomainPipe
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
