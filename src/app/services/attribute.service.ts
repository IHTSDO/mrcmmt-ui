import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {

    constructor() {
    }

    private attributes = new Subject<any>();
    private activeAttribute = new Subject<any>();
    private attributeMatchedDomains = new Subject<any>();
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
        // console.log('ACTIVE ATTRIBUTE: ', attribute);
        this.activeAttribute.next(attribute);
    }

    clearActiveAttribute() {
        this.activeAttribute.next();
    }

    getActiveAttribute(): Observable<any> {
        return this.activeAttribute.asObservable();
    }

    // Setters & Getters: Attribute Matched Domains
    setAttributeMatchedDomains(attributes) {
        this.attributeMatchedDomains.next(attributes);
    }

    clearAttributeMatchedDomains() {
        this.attributeMatchedDomains.next();
    }

    getAttributeMatchedDomains() {
        return this.attributeMatchedDomains.asObservable();
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
}
