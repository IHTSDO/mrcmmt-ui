import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RefSet } from '../../models/refset';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnInit {

    // bindings
    @Input() domains: RefSet[];
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() attributeMatchedDomains: RefSet[];
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();

    // filter
    domainFilter: string;

    // visibility flags
    preCoordination: boolean;
    postCoordination: boolean;


    constructor() {
    }

    ngOnInit() {
        this.domains = [];
        this.preCoordination = true;
        this.postCoordination = true;
    }

    makeActiveDomain(domain) {
        if (this.activeDomain === domain) {
            this.setActives(null, this.activeAttribute, this.activeRange);
        } else {
            this.activeDomain = domain;
            if (this.attributeMatchedDomains && this.attributeMatchedDomains.length > 1) {
                this.attributeMatchedDomains.forEach((item) => {
                    if (domain.referencedComponentId === item.additionalFields.domainId) {
                        this.activeAttribute = item;
                    }
                });
            }
            this.setActives(domain, this.activeAttribute, this.activeRange);

            if (this.activeAttribute && domain.referencedComponentId !== this.activeAttribute.additionalFields.domainId) {
                this.setActives(this.activeDomain, null, null);
            }
        }
    }

    setActives(domain, attribute, range) {
        this.activeDomainEmitter.emit(domain);
        this.activeAttributeEmitter.emit(attribute);
        this.activeRangeEmitter.emit(range);
    }

    highlightDomains(referencedComponentId) {
        const domains = [];
        if (this.attributeMatchedDomains && this.attributeMatchedDomains.length > 1) {
            this.attributeMatchedDomains.forEach((item) => {
                domains.push(item.additionalFields.domainId);
            });
        }
        if (this.activeAttribute && referencedComponentId === this.activeAttribute.additionalFields.domainId) {
            return true;
        }
        if (domains.length > 1 && domains.includes(referencedComponentId) ) {
            return true;
        }
    }
}
