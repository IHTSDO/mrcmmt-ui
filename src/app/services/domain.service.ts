import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DomainService {

    constructor() {
    }

    private domains = new Subject<any>();

    setDomains(domains) {
        console.log('DOMAINS: ', domains);
        this.domains.next(domains);
    }

    collectDomains(): Observable<any> {
        return this.domains.asObservable();
    }
}
