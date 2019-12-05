import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UIConfiguration } from '../models/uiConfiguration';
import { AuthoringService } from '../services/authoring.service';


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private authoringService: AuthoringService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError(err => {
                if (err.status === 403 ) {
                    let config: any = {};
                    this.authoringService.getUIConfiguration().subscribe(data => {
                        config = data;
                        window.location.href =
                        config.endpoints.imsEndpoint
                        + 'login?serviceReferer='
                        + window.location.href;
                    });
                }
              throw err;
            })
        );
    }
}
