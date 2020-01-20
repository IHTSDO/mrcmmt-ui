import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { Subscription } from 'rxjs';
import { DomainService } from '../../services/domain.service';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnInit, OnDestroy {

    // bindings
    @Input() domainFilter: string;
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() attributeMatchedDomains: RefSet[];
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();

    // visibility flags
    preCoordination: boolean;
    postCoordination: boolean;
    detailsExpanded: boolean;

    domains: object;
    domainSubscription: Subscription;

    constructor(private domainService: DomainService) {
        // subscribe to home component messages
        this.domainSubscription = this.domainService.collectDomains().subscribe(data => {
            this.domains = data;
        });
    }

    ngOnInit() {
        this.preCoordination = true;
        this.postCoordination = true;
        this.detailsExpanded = true;
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.domainSubscription.unsubscribe();
    }

    makeActiveDomain(domain) {
        let domainFound = false;
        if (this.activeDomain === domain) {
            this.detailsExpanded = true;
            this.setActives(null, this.activeAttribute, this.activeRange);
        } else {
            this.activeDomain = domain;
            if (this.attributeMatchedDomains && this.attributeMatchedDomains.length > 1) {
                this.attributeMatchedDomains.forEach((item) => {
                    if (domain.referencedComponentId === item.additionalFields.domainId) {
                        this.activeAttribute = item;
                        domainFound = true;
                    }
                });
            }
            if (!domainFound) {
                this.attributeMatchedDomains = [];
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
