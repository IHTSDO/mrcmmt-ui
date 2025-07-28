import {HttpInterceptorFn} from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (request, next) => {
        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                headers: request.headers.set('Content-Type', 'application/json'),
            });
        }

        return next(request);
};

