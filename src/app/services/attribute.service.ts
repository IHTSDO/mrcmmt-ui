import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
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

    private attributes = new ReplaySubject<any>(1);
    private activeAttribute = new ReplaySubject<any>(1);
    private matchedDomains = new ReplaySubject<any>(1);
    private attributeFilter = new ReplaySubject<any>(1);
    private latestReleaseAttributes: RefSet[];
    private latestReleaseActiveAttribute = new ReplaySubject<any>(1);
    private attributeHierarchy = new ReplaySubject<any>(1);
    private attributeHierarchyData: any;
    private attributesWithConcreteDomains = new ReplaySubject<any>(1);
    private attributesWithConcreteDomainsData: any[];

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
        this.attributeHierarchyData = attributes;
        this.attributeHierarchy.next(attributes);
    }

    getAttributeHierarchy() {
        return this.attributeHierarchyData;
    }

    // Setters & Getters: Attributes with Concrete Domains
    setAttributesWithConcreteDomains(attributes) {
        this.attributesWithConcreteDomainsData = attributes;
        this.attributesWithConcreteDomains.next(attributes);
    }

    getAttributesWithConcreteDomains() {
        return this.attributesWithConcreteDomainsData;
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
