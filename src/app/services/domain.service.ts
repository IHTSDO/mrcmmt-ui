import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class DomainService {

    constructor(private route: ActivatedRoute) {
    }

    private domains = new Subject<any>();
    private activeDomain = new Subject<any>();
    private domainFilter = new Subject<any>();

    // Setters & Getters: Domains
    setDomains(domains) {
        console.log('DOMAINS: ', domains);
        this.domains.next(domains);
    }

    clearDomains() {
        this.domains.next();
    }

    getDomains(): Observable<any> {
        return this.domains.asObservable();
    }

    // Setters & Getters: Active Domains
    setActiveDomain(domain) {
        // console.log('XYZ: ', this.route.snapshot.queryParamMap.get('domain'));
        this.activeDomain.next(domain);
    }

    clearActiveDomain() {
        this.activeDomain.next();
    }

    getActiveDomain(): Observable<any> {
        return this.activeDomain.asObservable();
    }

    // Setters & Getters: Domain Filter
    setDomainFilter(filter) {
        this.domainFilter.next(filter);
    }

    clearDomainFilter() {
        this.domainFilter.next();
    }

    getDomainFilter(): Observable<any> {
        return this.domainFilter.asObservable();
    }
}