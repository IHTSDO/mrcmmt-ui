// FRAMEWORK IMPORTS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';

// COMPONENT IMPORTS
import { SnomedNavbarComponent } from './components/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/snomed-footer/snomed-footer.component';
import { ApplicableAttributesPanelComponent } from './components/applicable-attributes-panel/applicable-attributes-panel.component';
import { DomainPanelComponent } from './components/domain-panel/domain-panel.component';
import { AttributeRangePanelComponent } from './components/attribute-range-panel/attribute-range-panel.component';

// PIPE IMPORTS
import { TextMatchPipe } from './pipes/text-match.pipe';

// SERVICE IMPORTS
import { TerminologyServerService } from './services/terminologyServer.service';
import { SnomedUtilityService } from './services/snomedUtility.service';
import { AuthoringService } from './services/authoring.service';
import { DuplicateFilterPipe } from './pipes/duplicate-filter.pipe';
import { DomainMatchPipe } from './pipes/domain-match.pipe';
import { BreadcrumbBarComponent } from './components/breadcrumb-bar/breadcrumb-bar.component';
import { AlphabeticalPipe } from './pipes/alphabetical.pipe';
import { CustomOrderPipe } from './pipes/custom-order.pipe';
import { TopLevelDomainPipe } from './pipes/top-level-domain.pipe';
import { DomainService } from './services/domain.service';
import { AttributeService } from './services/attribute.service';
import { RangeService } from './services/range.service';
import { EditService } from './services/edit.service';
import { MrcmmtService } from './services/mrcmmt.service';

// Interceptor Imports
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { InheritedDomainMatchPipe } from './pipes/inherited-domain-match.pipe';
import { BranchingService } from './services/branching.service';
import { BranchPathPipe } from './pipes/branch-path.pipe';

@NgModule({
    declarations: [
        AppComponent,
        SnomedNavbarComponent,
        SnomedFooterComponent,
        DomainPanelComponent,
        ApplicableAttributesPanelComponent,
        AttributeRangePanelComponent,
        TextMatchPipe,
        DuplicateFilterPipe,
        DomainMatchPipe,
        BreadcrumbBarComponent,
        AlphabeticalPipe,
        TopLevelDomainPipe,
        InheritedDomainMatchPipe,
        BranchPathPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgbTypeaheadModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        AppRoutingModule
    ],
    providers: [
        TerminologyServerService,
        AuthoringService,
        SnomedUtilityService,
        DomainService,
        AttributeService,
        RangeService,
        EditService,
        MrcmmtService,
        BranchingService,
        CustomOrderPipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
