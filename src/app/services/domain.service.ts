import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { RefSet } from '../models/refset';
import { AdditionalFields } from '../models/refset';
import { HttpClient } from '@angular/common/http';
import {AuthoringService} from './authoring.service';

@Injectable({
    providedIn: 'root'
})
export class DomainService {

    private extensionModuleId = new BehaviorSubject<any>('900000000000012004');
    internationalModuleIds: any[];
    private domains = new ReplaySubject<any>(1);
    private activeDomain = new ReplaySubject<any>(1);
    private domainFilter = new ReplaySubject<any>(1);
    private latestReleaseDomains: RefSet[];

    private _extensionModuleId: string;
    private _extensionModuleIdSubscription: Subscription;

    constructor(private http: HttpClient,
                private authoringService: AuthoringService) {
        this._extensionModuleIdSubscription = this.getExtensionModuleId().subscribe(data => this._extensionModuleId = data);
    }

    // Setters & Getters: Domains
    setDomains(domains) {
        this.domains.next(domains);
    }

    clearDomains() {
        this.domains.next(null);
    }

    getDomains(): Observable<any> {
        return this.domains.asObservable();
    }

    // Setters & Getters: Active Domains
    setActiveDomain(domain) {
        this.activeDomain.next(domain);
    }

    clearActiveDomain() {
        this.activeDomain.next(null);
    }

    getActiveDomain(): Observable<any> {
        return this.activeDomain.asObservable();
    }

    // Setters & Getters: Domain Filter
    setDomainFilter(filter) {
        this.domainFilter.next(filter);
    }

    clearDomainFilter() {
        this.domainFilter.next(null);
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

    // Setters & Getters: Latest Release
    setExtensionModuleId(id) {
        this.extensionModuleId.next(id);
    }

    getExtensionModuleId() {
        return this.extensionModuleId.asObservable();
    }

    // New Domain
    getNewDomain(): RefSet {
        let newRefset = new RefSet(
            new AdditionalFields(null),
            null,
            { id: null, fsn: { term: 'New Domain' }},
            '723560006',
            true,
            true,
            []
        );

        newRefset.moduleId = this._extensionModuleId;

        return newRefset;
    }

    httpGetExtensionModuleId(path: string) {
        return this.http.get(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + 'branches/MAIN' + (path === 'SNOMEDCT' ? '' : '/' + path));
    }
}
