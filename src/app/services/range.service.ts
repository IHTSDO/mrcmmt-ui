import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RefSet } from '../models/refset';

@Injectable({
    providedIn: 'root'
})
export class RangeService {

    constructor() {
    }

    private ranges = new Subject<any>();
    private activeRange = new Subject<any>();

    // Setters & Getters: Ranges
    setRanges(ranges) {
        console.log('RANGES: ', ranges);
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

    getNewRange(activeAttribute): RefSet {
        const newRange = new RefSet;
        newRange.additionalFields = {
            domainId: '',
            domainConstraint: '',
            parentDomain: '',
            proximalPrimitiveConstraint: '',
            proximalPrimitiveRefinement: '',
            domainTemplateForPrecoordination: '',
            domainTemplateForPostcoordination: '',
            grouped: '',
            attributeCardinality: '',
            attributeInGroupCardinality: '',
            contentTypeId: '',
            ruleStrengthId: '',
            rangeConstraint: '',
            attributeRule: ''
        };
        newRange.referencedComponentId = activeAttribute.referencedComponentId;
        newRange.referencedComponent = {
            id: activeAttribute.referencedComponentId,
            fsn: {
                term: activeAttribute.referencedComponent.fsn
            }
        };
        newRange.refsetId = '723562003';
        newRange.moduleId = '900000000000012004';
        newRange.changed = true;
        newRange.active = true;
        return newRange;
    }
}
