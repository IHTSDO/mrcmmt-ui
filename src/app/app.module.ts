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

// COMPONENT IMPORTS
import { SnomedNavbarComponent } from './components/snomed-navbar/snomed-navbar.component';
import { SnomedFooterComponent } from './components/snomed-footer/snomed-footer.component';

// PIPE IMPORTS
import { ExampleConceptSearchPipe } from './pipes/example-concept-search.pipe';

// SERVICE IMPORTS
import { ExampleServiceService } from './services/example-service.service';

@NgModule({
    declarations: [
        AppComponent,
        SnomedNavbarComponent,
        SnomedFooterComponent,
        ExampleConceptSearchPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgbTypeaheadModule
    ],
    providers: [
        ExampleServiceService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
