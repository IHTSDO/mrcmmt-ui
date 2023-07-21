import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import { AdditionalFields, ConcreteDomainParameters, RefSet } from '../models/refset';
import {DomainService} from './domain.service';

@Injectable({
    providedIn: 'root'
})
export class RangeService {

    constructor(private domainService: DomainService) {
        this.extensionModuleIdSubscription = this.domainService.getExtensionModuleId().subscribe(data => this.extensionModuleId = data);
    }

    private ranges = new Subject<any>();
    private activeRange = new Subject<any>();
    private latestReleaseActiveRange = new Subject<any>();

    private extensionModuleId: string;
    private extensionModuleIdSubscription: Subscription;

    // Setters & Getters: Ranges
    setRanges(ranges) {
        this.ranges.next(ranges);
    }

    clearRanges() {
        this.ranges.next(null);
    }

    getRanges(): Observable<any> {
        return this.ranges.asObservable();
    }

    // Setters & Getters: Active Range
    setActiveRange(range) {
        this.activeRange.next(range);
    }

    clearActiveRange() {
        this.activeRange.next(null);
    }

    getActiveRange(): Observable<any> {
        return this.activeRange.asObservable();
    }

    // Setters & Getters: Latest Release Active Range
    setLatestReleaseActiveRange(range) {
        this.latestReleaseActiveRange.next(range);
    }

    clearLatestReleaseActiveRange() {
        this.latestReleaseActiveRange.next(null);
    }

    getLatestReleaseActiveRange(): Observable<any> {
        return this.latestReleaseActiveRange.asObservable();
    }

    // New Range
    getNewRange(activeAttribute): RefSet {
        const newRange = new RefSet(
            new AdditionalFields(null),
            activeAttribute.referencedComponentId,
            { id: activeAttribute.referencedComponentId, fsn: { term: activeAttribute.referencedComponent.fsn }},
            '723562003',
            true,
            true,
            []
        );

        newRange.additionalFields.ruleStrengthId = '723597001';
        newRange.additionalFields.contentTypeId = '723596005';

        if (activeAttribute.concreteDomainAttribute) {
            newRange.concreteDomainParameters = new ConcreteDomainParameters();
        }

        newRange.moduleId = this.extensionModuleId;

        return newRange;
    }
}
