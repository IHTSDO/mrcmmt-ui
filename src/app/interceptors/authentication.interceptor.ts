import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthoringService } from '../services/authoring.service';


export const authenticationInterceptor: HttpInterceptorFn = (request, next) => {

    const authoringService = inject(AuthoringService);
    const isPublic = window.location.host.includes('browser');

        return next(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError(err => {
                if (err.status === 403 && !isPublic) {
                    let config: any = {};
                    authoringService.getUIConfiguration().subscribe(data => {
                        config = data;
                        window.location.href =
                        config.endpoints.imsEndpoint
                        + 'login?serviceReferer='
                        + window.location.href;
                    });
                }
             return throwError(() => err);
            })
        );
}
