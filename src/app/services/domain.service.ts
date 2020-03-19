import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RefSet } from '../models/refset';
import { AdditionalFields } from '../models/refset';

@Injectable({
    providedIn: 'root'
})
export class DomainService {

    constructor() {
    }

    private domains = new Subject<any>();
    private activeDomain = new Subject<any>();
    private domainFilter = new Subject<any>();
    private latestReleaseDomains: RefSet[];

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

    // Setters & Getters: Latest Release
    setLatestReleaseDomains(domains) {
        this.latestReleaseDomains = domains.items;
    }

    getLatestReleaseDomains() {
        return this.latestReleaseDomains;
    }

    // New Domain
    getNewDomain(): RefSet {
        return new RefSet(
            new AdditionalFields(null),
            null,
            { id: null, fsn: { term: 'New Domain' }},
            '723560006',
            true,
            true,
            []
        );
    }

}
