import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { SnomedNavbarComponent } from './components/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/snomed-footer/snomed-footer.component';
import { ApplicableAttributesPanelComponent } from './components/applicable-attributes-panel/applicable-attributes-panel.component';
import { DomainPanelComponent } from './components/domain-panel/domain-panel.component';
import { AttributeRangePanelComponent } from './components/attribute-range-panel/attribute-range-panel.component';
import { ModalComponent } from './components/modal/modal.component';
import { TextMatchPipe } from './pipes/text-match.pipe';
import { AttributeNestingPipe } from './pipes/attribute-nesting.pipe';
import { InheritedDomainMatchPipe } from './pipes/inherited-domain-match.pipe';
import { AlphabeticalPipe } from './pipes/alphabetical.pipe';
import { CustomOrderPipe } from './pipes/custom-order.pipe';
import { TopLevelDomainPipe } from './pipes/top-level-domain.pipe';
import { DuplicateFilterPipe } from './pipes/duplicate-filter.pipe';
import { DomainMatchPipe } from './pipes/domain-match.pipe';
import { TerminologyServerService } from './services/terminologyServer.service';
import { SnomedUtilityService } from './services/snomedUtility.service';
import { ValidationService } from './services/validation.service';
import { AuthoringService } from './services/authoring.service';
import { BreadcrumbBarComponent } from './components/breadcrumb-bar/breadcrumb-bar.component';
import { DomainService } from './services/domain.service';
import { AttributeService } from './services/attribute.service';
import { RangeService } from './services/range.service';
import { EditService } from './services/edit.service';
import { MrcmmtService } from './services/mrcmmt.service';
import { BranchingService } from './services/branching.service';
import { AuthenticationService } from './services/authentication.service';
import { ModalService } from './services/modal.service';
import { UrlParamsService } from './services/url-params.service';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ToastrModule} from 'ngx-toastr';
import { ProjectAlphabeticalPipe } from './pipes/project-alphabetical.pipe';

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
        AttributeNestingPipe,
        BreadcrumbBarComponent,
        AlphabeticalPipe,
        TopLevelDomainPipe,
        InheritedDomainMatchPipe,
        ModalComponent,
        ProjectAlphabeticalPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgbTypeaheadModule,
        AppRoutingModule,
        MatCheckboxModule,
        ToastrModule.forRoot()
    ],
    providers: [
        TerminologyServerService,
        AuthoringService,
        SnomedUtilityService,
        ValidationService,
        DomainService,
        AttributeService,
        RangeService,
        EditService,
        MrcmmtService,
        BranchingService,
        AuthenticationService,
        CustomOrderPipe,
        ModalService,
        UrlParamsService,
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
