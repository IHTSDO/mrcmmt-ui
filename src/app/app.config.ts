import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { provideToastr } from "ngx-toastr";
import { routes } from "./app.routes";
import { headerInterceptor } from "./interceptors/header.interceptor";
import { authenticationInterceptor } from "./interceptors/authentication.interceptor";
import { CustomOrderPipe } from "./pipes/custom-order.pipe";


export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, NgbTypeaheadModule, MatCheckboxModule),
        CustomOrderPipe,
        provideAnimations(),
        provideToastr(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([headerInterceptor, authenticationInterceptor])),
    ]
};