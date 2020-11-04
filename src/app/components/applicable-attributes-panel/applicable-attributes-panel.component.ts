import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { RefsetError } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { Observable, Subscription } from 'rxjs';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { EditService } from '../../services/edit.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { UrlParamsService } from '../../services/url-params.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SnomedUtilityService } from '../../services/snomedUtility.service';
import { ValidationService } from '../../services/validation.service';
import { SnomedResponseObject } from '../../models/snomedResponseObject';
import { BranchingService } from '../../services/branching.service';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss'],
    providers: [ CustomOrderPipe ]
})
export class ApplicableAttributesPanelComponent implements OnDestroy {

    detailsExpanded = true;

    latestReleaseAttribute: RefSet;

    latestReleaseRange: RefSet;
    latestReleaseRangeSubscription: Subscription;
    domains: SnomedResponseObject;
    domainSubscription: Subscription;
    attributes: SnomedResponseObject;
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
    changeLog: RefSet[];
    changeLogSubscription: Subscription;

    // typeahead
    shortFormConcept: string;
    search = (text$: Observable<string>) => text$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
            if (term.length < 3) {
                return [];
            } else {
                return this.terminologyService.getTypeahead(term);
            }
        })
    )

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private terminologyService: TerminologyServerService,
                private customOrder: CustomOrderPipe,
                private editService: EditService,
                public mrcmmtService: MrcmmtService,
                private validationService: ValidationService,
                private urlParamsService: UrlParamsService,
                private branchingService: BranchingService) {
        this.domainSubscription = this.domainService.getDomains().subscribe(data => this.domains = data);
        this.attributeSubscription = this.attributeService.getAttributes().subscribe(data => this.attributes = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.setLatestActiveAttribute();
            this.urlParamsService.updateActiveRefsetParams(this.domainService, data, this.activeRange);
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
        this.matchedDomainsSubscription = this.attributeService.getMatchedDomains().subscribe(data => this.matchedDomains = data);
        this.attributeFilterSubscription = this.attributeService.getAttributeFilter().subscribe(data => this.attributeFilter = data);
        this.editSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
        this.latestReleaseRangeSubscription = this.rangeService.getLatestReleaseActiveRange().subscribe(data => {
            this.latestReleaseRange = data;
        });
    }

    ngOnDestroy() {
        this.domainSubscription.unsubscribe();
        this.attributeSubscription.unsubscribe();
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.matchedDomainsSubscription.unsubscribe();
        this.editSubscription.unsubscribe();
        this.changeLogSubscription.unsubscribe();
    }

    makeActiveAttribute(attribute) {
        const attributeMatchedDomains = [];
        this.attributeService.clearMatchedDomains();
        this.rangeService.clearRanges();

        if (this.activeAttribute === attribute) {
            this.detailsExpanded = true;
            this.latestReleaseAttribute = null;
            this.rangeService.clearLatestReleaseActiveRange();
            this.setActives(this.activeDomain, null, null);
            this.attributeService.clearMatchedDomains();
            this.rangeService.clearRanges();

            this.setLatestActiveAttribute();
        } else {
            this.activeAttribute = attribute;
            this.shortFormConcept = null;

            this.setLatestActiveAttribute();

            if (this.activeAttribute.referencedComponentId) {
                this.terminologyService.getConcept(this.activeAttribute.referencedComponentId).subscribe(data => {
                    this.shortFormConcept = SnomedUtilityService.convertShortConceptToString(data);
                });
            }

            attributeMatchedDomains.push(this.activeAttribute);
            this.attributes['items'].forEach((item) => {
                if (this.activeAttribute.memberId !== item.memberId &&
                    this.activeAttribute.referencedComponentId === item.referencedComponentId) {
                    attributeMatchedDomains.push(item);
                }
            });

            this.attributeService.setMatchedDomains(attributeMatchedDomains);
            this.automaticDomainSelect(this.activeAttribute, attributeMatchedDomains);

            this.setRange();
        }
    }

    setLatestActiveAttribute() {
        if (this.activeAttribute) {
            this.latestReleaseAttribute = this.attributeService.getLatestReleaseAttributes().find(item => {
                return item.memberId === this.activeAttribute.memberId;
            });
        }
    }

    setActives(domain, attribute, range) {
        this.domainService.setActiveDomain(domain);
        this.attributeService.setActiveAttribute(attribute);
        this.rangeService.setActiveRange(range);
    }

    setRange() {
        this.rangeService.setRanges(new SnomedResponseObject());

        if (this.activeAttribute.referencedComponentId) {
            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(data => {
                data.items.forEach(item => {
                    if (item.additionalFields.rangeConstraint.startsWith('dec')
                        || item.additionalFields.rangeConstraint.startsWith('int')
                        || item.additionalFields.rangeConstraint.startsWith('str')) {
                        this.mrcmmtService.rangeConstraintToConcreteDomainParameters(item);
                    }
                });

                const ranges: SnomedResponseObject = { items: data.items, total: data.total, errorMessage: null};

                ranges.items = ranges.items.concat(this.changeLog.filter(item => {
                    return this.activeAttribute.referencedComponentId === item.referencedComponentId;
                }));

                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.rangeService.setRanges(ranges);

                this.terminologyService.getRanges(this.activeAttribute.referencedComponentId,
                    this.branchingService.getLatestReleaseBranchPath()).subscribe(response => {
                    this.rangeService.setLatestReleaseActiveRange(response.items.find(item => {
                        return item.referencedComponentId === ranges.items[0].referencedComponentId;
                    }));

                    this.setActives(this.activeDomain, this.activeAttribute, ranges.items[0]);
                });
            });
        }
    }

    updateAttributeId() {
        if (!this.activeAttribute.referencedComponentId) {
            this.activeAttribute.referencedComponentId = SnomedUtilityService.getIdFromShortConcept(this.shortFormConcept);

            this.setRange();
        }

        this.updateAttribute();
    }

    updateCardinality(input) {
        const error = this.validationService.validateCardinality(input);
        if (error.length > 0) {
            if (!this.activeAttribute.errors) {
                this.activeAttribute.errors = [];
            }
            this.activeAttribute.errors.push(new RefsetError(error, ''));
        }
    }

    updateAttribute() {
        this.activeAttribute.changed = true;

        this.activeAttribute.errors = [];
        if (this.activeAttribute.additionalFields.attributeCardinality) {
            this.updateCardinality(this.activeAttribute.additionalFields.attributeCardinality);
        }
        if (this.activeAttribute.additionalFields.attributeInGroupCardinality) {
            this.updateCardinality(this.activeAttribute.additionalFields.attributeInGroupCardinality);
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

    deleteAttribute(event, attribute) {
        event.stopPropagation();
        attribute.deleted = true;

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === attribute.memberId) {
                    item.deleted = true;
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(attribute);
            this.editService.setChangeLog(this.changeLog);
        }
        this.attributeService.clearMatchedDomains();
        this.rangeService.clearRanges();
    }

    duplicateAttributes(attribute, results) {
        const temp = results.filter(item => attribute.referencedComponentId === item.referencedComponentId);
        return temp.length > 1;
    }

    addNewAttribute() {
        this.shortFormConcept = null;
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

            const activeDomain = activeDomainList.find(item => {
                return item.referencedComponentId === this.activeAttribute.additionalFields.domainId;
            });

            this.setActives(activeDomain, attribute, null);
        }
    }
}
