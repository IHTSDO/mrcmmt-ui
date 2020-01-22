import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { ChangeLog } from '../../models/changeLog';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { Subscription } from 'rxjs';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { EditService } from '../../services/edit.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    editable: Boolean;
    editSubscription: Subscription;
    unsavedChanges: Boolean;
    unsavedChangesSubscription: Subscription;
    changeLog: ChangeLog[];
    changeLogSubscription: Subscription;

    ruleStrengthFields =
            [
                {
                    id: '723597001',
                    term: 'Mandatory concept model rule'
                },
                {
                    id: '723598006',
                    term: 'Optional concept model rule'
                }
            ];

    contentTypeFields =
        [
            {
                id: '723596005',
                term: 'All SNOMED CT content'
            },
            {
                id: '723593002',
                term: 'All new precoordinated SNOMED CT content'
            },
            {
                id: '723594008',
                term: 'All precoordinated SNOMED CT content'
            },
            {
                id: '723595009',
                term: 'All postcoordinated SNOMED CT content'
            }
        ];


    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private terminologyService: TerminologyServerService, private customOrder: CustomOrderPipe,
                private editService: EditService, private router: Router, private route: ActivatedRoute) {
        this.domainSubscription = this.domainService.getDomains().subscribe(data => this.domains = data);
        this.attributeSubscription = this.attributeService.getAttributes().subscribe(data => this.attributes = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.queryStringParameterBuilder(data);
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
    }

    queryStringParameterBuilder(data) {
        const params = {};
        if (this.activeDomain) {
            params['domain'] = this.activeDomain.referencedComponentId;
        }
        if (this.activeAttribute) {
            params['attribute'] = data.referencedComponentId;
        }
        if (this.activeRange) {
            params['range'] = this.activeRange.additionalFields.contentTypeId;
        }
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge'
            });
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
            const change = new ChangeLog;
            change.memberId = this.activeAttribute.memberId;
            change.update = true;
            this.changeLog.push(change);
            this.editService.setChangeLog(this.changeLog);
            console.log(this.changeLog);
        }

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
