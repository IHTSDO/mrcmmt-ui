import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RefSet } from '../models/refset';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {

    constructor() {
    }

    private attributes = new Subject<any>();
    private activeAttribute = new Subject<any>();
    private matchedDomains = new Subject<any>();
    private attributeFilter = new Subject<any>();

    // Setters & Getters: Attributes
    setAttributes(attributes) {
        console.log('ATTRIBUTES: ', attributes);
        this.attributes.next(attributes);
    }

    clearAttributes() {
        this.attributes.next();
    }

    getAttributes(): Observable<any> {
        return this.attributes.asObservable();
    }

    // Setters & Getters: Active Attribute
    setActiveAttribute(attribute) {
        this.activeAttribute.next(attribute);
    }

    clearActiveAttribute() {
        this.activeAttribute.next();
    }

    getActiveAttribute(): Observable<any> {
        return this.activeAttribute.asObservable();
    }

    // Setters & Getters: Attribute Matched Domains
    setMatchedDomains(attributes) {
        this.matchedDomains.next(attributes);
    }

    clearMatchedDomains() {
        this.matchedDomains.next();
    }

    getMatchedDomains() {
        return this.matchedDomains.asObservable();
    }

    // Setters & Getters: Attribute Filter
    setAttributeFilter(filter) {
        this.attributeFilter.next(filter);
    }

    clearAttributeFilter() {
        this.attributeFilter.next();
    }

    getAttributeFilter(): Observable<any> {
        return this.attributeFilter.asObservable();
    }

    getNewAttribute(activeDomain): RefSet {
        const newAttribute = new RefSet;
        newAttribute.additionalFields = {
            domainId: activeDomain.referencedComponentId,
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
        newAttribute.referencedComponent = {
            id: null,
            fsn: {
                term: 'New Attribute'
            }
        };
        newAttribute.refsetId = '723561005';
        newAttribute.moduleId = '900000000000012004';
        newAttribute.changed = true;
        newAttribute.active = true;
        return newAttribute;
    }
}
