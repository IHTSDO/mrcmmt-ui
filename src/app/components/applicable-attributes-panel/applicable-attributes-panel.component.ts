import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { Subscription } from 'rxjs';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { EditService } from '../../services/edit.service';
import { MrcmmtService } from '../../services/mrcmmt.service';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss'],
    providers: [ CustomOrderPipe ]
})
export class ApplicableAttributesPanelComponent implements OnDestroy {

    detailsExpanded = true;

    domains: object;
    domainSubscription: Subscription;
    attributes: object;
    attributeSubscription: Subscription;
    attributeFilter: string;
    attributeFilterSubscription: Subscription;
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
                private terminologyService: TerminologyServerService, private customOrder: CustomOrderPipe,
                private editService: EditService, private mrcmmtService: MrcmmtService) {
        this.domainSubscription = this.domainService.getDomains().subscribe(data => this.domains = data);
        this.attributeSubscription = this.attributeService.getAttributes().subscribe(data => this.attributes = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.mrcmmtService.queryStringParameterSetter(this.domainService, data, this.activeRange);
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
        this.matchedDomainsSubscription = this.attributeService.getMatchedDomains().subscribe(data => this.matchedDomains = data);
        this.attributeFilterSubscription = this.attributeService.getAttributeFilter().subscribe(data => this.attributeFilter = data);
        this.editSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.unsavedChangesSubscription = this.editService.getUnsavedChanges().subscribe(data => this.unsavedChanges = data);
        this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
    }

    ngOnDestroy() {
        this.domainSubscription.unsubscribe();
        this.attributeSubscription.unsubscribe();
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.matchedDomainsSubscription.unsubscribe();
        this.editSubscription.unsubscribe();
        this.unsavedChangesSubscription.unsubscribe();
        this.changeLogSubscription.unsubscribe();
    }

    makeActiveAttribute(attribute) {
        const attributeMatchedDomains = [];
        this.attributeService.clearMatchedDomains();
        this.rangeService.clearRanges();

        if (this.activeAttribute === attribute) {
            this.detailsExpanded = true;
            this.setActives(this.activeDomain, null, null);
            this.attributeService.clearMatchedDomains();
            this.rangeService.clearRanges();
        } else {
            this.activeAttribute = attribute;
            attributeMatchedDomains.push(attribute);
            this.attributes['items'].forEach((item) => {
                if (this.activeAttribute.memberId !== item.memberId &&
                    this.activeAttribute.referencedComponentId === item.referencedComponentId) {
                    attributeMatchedDomains.push(item);
                }
            });

            this.attributeService.setMatchedDomains(attributeMatchedDomains);
            this.automaticDomainSelect(attribute, attributeMatchedDomains);

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(ranges => {
                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.setActives(this.activeDomain, attribute, ranges.items[0]);
                this.rangeService.setRanges(ranges);
            });
        }
    }

    setActives(domain, attribute, range) {
        this.domainService.setActiveDomain(domain);
        this.attributeService.setActiveAttribute(attribute);
        this.rangeService.setActiveRange(range);
    }

    updateAttribute() {
        this.activeAttribute.changed = true;

        if (!this.unsavedChanges) {
            this.editService.setUnsavedChanges(true);
        }

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === this.activeAttribute.memberId) {
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(this.activeAttribute);
            this.editService.setChangeLog(this.changeLog);
        }
    }

    deleteAttribute() {
        this.activeAttribute.deleted = true;

        if (!this.unsavedChanges) {
            this.editService.setUnsavedChanges(true);
        }

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === this.activeAttribute.memberId) {
                    item.deleted = true;
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(this.activeAttribute);
            this.editService.setChangeLog(this.changeLog);
        }
        this.setActives(this.activeDomain, null, null);
        this.attributeService.clearMatchedDomains();
        this.rangeService.clearRanges();
    }

    duplicateAttributes(attribute, results) {
        const temp = results.filter(item => attribute.referencedComponentId === item.referencedComponentId);
        return temp.length > 1;
    }

    addNewAttribute() {
        const newAttribute = this.attributeService.getNewAttribute(this.activeDomain);
        this.attributes['items'].push(newAttribute);
        this.attributeService.setAttributes(this.attributes);
        this.attributeService.clearMatchedDomains();
        this.rangeService.clearRanges();
        this.activeAttribute = newAttribute;
        this.setActives(this.activeDomain, this.activeAttribute, null);
    }

    automaticDomainSelect(attribute, attributeMatchedDomains) {
        if (!this.activeDomain) {
            const activeDomainList = [];

            for (let i = 0; i < this.domains['items'].length; i++) {
                for (let j = 0; j < attributeMatchedDomains.length; j++) {
                    if (this.domains['items'][i].referencedComponentId === attributeMatchedDomains[j].additionalFields.domainId) {
                        activeDomainList.push(this.domains['items'][i]);
                    }
                }
            }
            this.setActives(activeDomainList[0], attribute, null);
        }
    }
}
