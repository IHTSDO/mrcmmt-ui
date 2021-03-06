import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AdditionalFields, ConcreteDomainParameters, RefSet } from '../models/refset';

@Injectable({
    providedIn: 'root'
})
export class RangeService {

    constructor() {
    }

    private ranges = new Subject<any>();
    private activeRange = new Subject<any>();
    private latestReleaseActiveRange = new Subject<any>();

    // Setters & Getters: Ranges
    setRanges(ranges) {
        // console.log('RANGES: ', ranges);
        this.ranges.next(ranges);
    }

    clearRanges() {
        this.ranges.next();
    }

    getRanges(): Observable<any> {
        return this.ranges.asObservable();
    }

    // Setters & Getters: Active Range
    setActiveRange(range) {
        this.activeRange.next(range);
    }

    clearActiveRange() {
        this.activeRange.next();
    }

    getActiveRange(): Observable<any> {
        return this.activeRange.asObservable();
    }

    // Setters & Getters: Latest Release Active Range
    setLatestReleaseActiveRange(range) {
        this.latestReleaseActiveRange.next(range);
    }

    clearLatestReleaseActiveRange() {
        this.latestReleaseActiveRange.next();
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

        return newRange;
    }
}
