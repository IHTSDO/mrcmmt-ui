import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import { AdditionalFields, RefSet } from '../models/refset';
import { Hierarchy } from '../models/hierarchy';
import {DomainService} from './domain.service';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {

    constructor(private domainService: DomainService) {
        this.extensionModuleIdSubscription = this.domainService.getExtensionModuleId().subscribe(data => this.extensionModuleId = data);
    }

    private attributes = new Subject<any>();
    private activeAttribute = new Subject<any>();
    private matchedDomains = new Subject<any>();
    private attributeFilter = new Subject<any>();
    private latestReleaseAttributes: RefSet[];
    private latestReleaseActiveAttribute = new Subject<any>();
    private attributeHierarchy = new Subject<any>();
    private attributesWithConcreteDomains = new Subject<any>();

    private extensionModuleId: string;
    private extensionModuleIdSubscription: Subscription;

    // Setters & Getters: Attributes
    setAttributes(attributes) {
        this.attributes.next(attributes);
    }

    clearAttributes() {
        this.attributes.next(null);
    }

    getAttributes(): Observable<any> {
        return this.attributes.asObservable();
    }

    // Setters & Getters: Active Attribute
    setActiveAttribute(attribute) {
        this.activeAttribute.next(attribute);
    }

    clearActiveAttribute() {
        this.activeAttribute.next(null);
    }

    getActiveAttribute(): Observable<any> {
        return this.activeAttribute.asObservable();
    }

    // Setters & Getters: Attribute Matched Domains
    setMatchedDomains(attributes) {
        this.matchedDomains.next(attributes);
    }

    clearMatchedDomains() {
        this.matchedDomains.next(null);
    }

    getMatchedDomains() {
        return this.matchedDomains.asObservable();
    }

    // Setters & Getters: Attribute Filter
    setAttributeFilter(filter) {
        this.attributeFilter.next(filter);
    }

    clearAttributeFilter() {
        this.attributeFilter.next(null);
    }

    getAttributeFilter(): Observable<any> {
        return this.attributeFilter.asObservable();
    }

    // Setters & Getters: Latest Release
    setLatestReleaseAttributes(attributes) {
        this.latestReleaseAttributes = attributes.items;
    }

    getLatestReleaseAttributes() {
        return this.latestReleaseAttributes;
    }

    // Setters & Getters: Attribute Hierarchy
    setAttributeHierarchy(attributes) {
        this.attributeHierarchy = attributes;
    }

    getAttributeHierarchy() {
        return this.attributeHierarchy;
    }

    // Setters & Getters: Attributes with Concrete Domains
    setAttributesWithConcreteDomains(attributes) {
        this.attributesWithConcreteDomains = attributes;
    }

    getAttributesWithConcreteDomains() {
        return this.attributesWithConcreteDomains;
    }

    // New Attribute
    getNewAttribute(activeDomain): RefSet {
        const attribute = new RefSet(
            new AdditionalFields(activeDomain.referencedComponentId),
            null,
            { id: null, fsn: { term: 'New Attribute' }},
            '723561005',
            true,
            true,
            []
        );

        attribute.additionalFields.ruleStrengthId = '723597001';
        attribute.additionalFields.contentTypeId = '723596005';
        attribute.additionalFields.depth = 1;
        attribute.additionalFields.grouped = '1';

        attribute.moduleId = this.extensionModuleId;

        return attribute;
    }
}
