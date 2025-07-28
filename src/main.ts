import { enableProdMode} from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

enableProdMode();

bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.log(err));
