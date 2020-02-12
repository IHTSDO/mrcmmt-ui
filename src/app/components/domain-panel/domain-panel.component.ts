import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { Subscription } from 'rxjs';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { EditService } from '../../services/edit.service';
import { UrlParamsService } from '../../services/url-params.service';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnDestroy {

    preCoordination = true;
    postCoordination = true;
    detailsExpanded = true;

    domains: object;
    domainSubscription: Subscription;
    domainFilter: string;
    domainFilterSubscription: Subscription;
    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;
    matchedDomains: RefSet[];
    matchedDomainsSubscription: Subscription;
    editable: boolean;
    editSubscription: Subscription;
    unsavedChanges: boolean;
    unsavedChangesSubscription: Subscription;
    changeLog: RefSet[];
    changeLogSubscription: Subscription;


    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private mrcmmtService: MrcmmtService, private editService: EditService, private urlParamsService: UrlParamsService) {
        this.domainSubscription = this.domainService.getDomains().subscribe(data => this.domains = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => {
            this.activeDomain = data;
            this.urlParamsService.updateActiveRefsetParams(data, this.activeAttribute, this.activeRange);
        });
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => this.activeAttribute = data);
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
        this.domainFilterSubscription = this.domainService.getDomainFilter().subscribe(data => this.domainFilter = data);
        this.matchedDomainsSubscription = this.attributeService.getMatchedDomains().subscribe(data => this.matchedDomains = data);
        this.editSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.unsavedChangesSubscription = this.editService.getUnsavedChanges().subscribe(data => this.unsavedChanges = data);
        this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
    }

    ngOnDestroy() {
        this.domainSubscription.unsubscribe();
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.domainFilterSubscription.unsubscribe();
        this.matchedDomainsSubscription.unsubscribe();
        this.editSubscription.unsubscribe();
        this.unsavedChangesSubscription.unsubscribe();
        this.changeLogSubscription.unsubscribe();
    }

    makeActiveDomain(domain) {
        let domainFound = false;
        if (this.activeDomain === domain) {
            this.detailsExpanded = true;
            this.setActives(null, this.activeAttribute, this.activeRange);
        } else {
            this.activeDomain = domain;
            if (this.matchedDomains && this.matchedDomains.length > 1) {
                this.matchedDomains.forEach((item) => {
                    if (domain.referencedComponentId === item.additionalFields.domainId) {
                        this.activeAttribute = item;
                        domainFound = true;
                    }
                });
            }
            if (!domainFound) {
                this.matchedDomains = [];
            }
            this.setActives(domain, this.activeAttribute, this.activeRange);

            if (this.activeAttribute && domain.referencedComponentId !== this.activeAttribute.additionalFields.domainId) {
                this.setActives(this.activeDomain, null, null);
            }
        }
    }

    setActives(domain, attribute, range) {
        this.domainService.setActiveDomain(domain);
        this.attributeService.setActiveAttribute(attribute);
        this.rangeService.setActiveRange(range);
    }

    updateDomain() {
        this.activeDomain.changed = true;

        if (!this.unsavedChanges) {
            this.editService.setUnsavedChanges(true);
        }

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === this.activeDomain.memberId) {
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(this.activeDomain);
            this.editService.setChangeLog(this.changeLog);
        }
    }

    deleteDomain(event, domain) {
        event.stopPropagation();
        domain.deleted = true;

        if (!this.unsavedChanges) {
            this.editService.setUnsavedChanges(true);
        }

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === domain.memberId) {
                    item.deleted = true;
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(domain);
            this.editService.setChangeLog(this.changeLog);
        }
    }

    addNewDomain() {
        const newDomain = this.domainService.getNewDomain();
        this.domains['items'].push(newDomain);
        this.domainService.setDomains(this.domains);
        this.setActives(newDomain, null, null);
    }

    highlightDomains(referencedComponentId) {
        const domains = [];
        if (this.matchedDomains && this.matchedDomains.length > 1) {
            this.matchedDomains.forEach((item) => {
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
