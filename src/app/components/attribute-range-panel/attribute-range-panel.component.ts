import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { range, Subscription } from 'rxjs';
import { RangeService } from '../../services/range.service';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { EditService } from '../../services/edit.service';
import { UrlParamsService } from '../../services/url-params.service';
import { BranchingService } from '../../services/branching.service';
import { ModalService } from '../../services/modal.service';
import { SnomedUtilityService } from '../../services/snomedUtility.service';
import { SnomedResponseObject } from '../../models/snomedResponseObject';
import { max, min } from 'rxjs/operators';

export class Results {
    items: object[];
    total: string;
}

@Component({
    selector: 'app-attribute-range-panel',
    templateUrl: './attribute-range-panel.component.html',
    styleUrls: ['./attribute-range-panel.component.scss']
})
export class AttributeRangePanelComponent implements OnDestroy {

    results: Results;
    // rangeConstraint: boolean;
    attributeRuleInvalid: boolean;
    rangeConstraintModal = true;
    attributeRuleModal = true;

    latestReleaseRange: RefSet;
    latestReleaseRangeSubscription: Subscription;
    ranges: SnomedResponseObject;
    rangeSubscription: Subscription;
    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;
    editable: boolean;
    editSubscription: Subscription;
    changeLog: RefSet[];
    changeLogSubscription: Subscription;

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private terminologyService: TerminologyServerService,
                public mrcmmtService: MrcmmtService,
                private editService: EditService,
                private urlParamsService: UrlParamsService,
                private branchingService: BranchingService,
                public modalService: ModalService) {
        this.rangeSubscription = this.rangeService.getRanges().subscribe(data => this.ranges = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.clearResults();
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => {
            this.activeRange = data;
            this.urlParamsService.updateActiveRefsetParams(this.activeDomain, this.activeAttribute, data);
            this.getResults();
        });
        this.editSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
        this.latestReleaseRangeSubscription = this.rangeService.getLatestReleaseActiveRange().subscribe(data => {
            this.latestReleaseRange = data;
        });
    }

    ngOnDestroy() {
        this.rangeSubscription.unsubscribe();
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.editSubscription.unsubscribe();
        this.changeLogSubscription.unsubscribe();
    }

    makeActiveRange(range) {
        this.clearResults();

        if (this.activeRange === range) {
            this.rangeService.clearLatestReleaseActiveRange();
            this.rangeService.clearRanges();
            this.setActives(this.activeDomain, this.activeAttribute, null);
        } else {
            this.activeRange = range;

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId,
                this.branchingService.getLatestReleaseBranchPath()).subscribe(ranges => {

                this.rangeService.setLatestReleaseActiveRange(ranges.items.find(item => {
                    return item.referencedComponentId === this.activeRange.referencedComponentId;
                }));
            });

            this.setActives(this.activeDomain, this.activeAttribute, this.activeRange);
            this.getResults();
        }
    }

    validateEcl() {
        this.attributeRuleInvalid = false;
        this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
            if (data.items.length === 0) {
                    this.attributeRuleInvalid = true;
                }
            });
        this.updateRange();
    }

    updateRange() {
        this.activeRange.changed = true;

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === this.activeRange.memberId) {
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(this.activeRange);
            this.editService.setChangeLog(this.changeLog);
        }
    }

    deleteRange() {
        this.activeRange.deleted = true;

        let found = false;
        if (this.changeLog) {
            this.changeLog.forEach((item) => {
                if (item.memberId === this.activeRange.memberId) {
                    item.deleted = true;
                    found = true;
                }
            });
        } else {
            this.changeLog = [];
        }

        if (!found) {
            this.changeLog.push(this.activeRange);
            this.editService.setChangeLog(this.changeLog);
        }
        this.setActives(this.activeDomain, this.activeAttribute, null);
        this.clearResults();
    }

    updateAttributeType() {
        const minQualVal = this.activeRange.concreteDomainParameters.minimumQualifierValue;
        const minVal = this.activeRange.concreteDomainParameters.minimumValue;
        const maxQualVal = this.activeRange.concreteDomainParameters.maximumQualifierValue;
        const maxVal = this.activeRange.concreteDomainParameters.maximumValue;
        let rangeConstraint = this.activeRange.additionalFields.rangeConstraint;

        switch (this.activeRange.concreteDomainParameters.attributeType) {
            case 'Decimal':
                rangeConstraint = 'dec(';

                if (minQualVal) {
                    if (minQualVal === '>' || minQualVal === '<') {
                        rangeConstraint += minQualVal;
                        rangeConstraint += minVal;
                    } else if (minQualVal === '>=' || minQualVal === '<=') {
                        rangeConstraint += minVal;
                    }
                } else if (maxQualVal) {
                    if (maxQualVal === '>' || maxQualVal === '<') {
                        rangeConstraint += maxQualVal;
                        rangeConstraint += maxVal;
                    } else if (maxQualVal === '>=' || maxQualVal === '<=') {
                        rangeConstraint += maxVal;
                    }
                }
                rangeConstraint += '..)';
                break;
            case 'Integer':
                rangeConstraint = 'int(';

                if (!minQualVal && !maxQualVal) {
                    if (minVal && !maxVal) {
                        rangeConstraint += minVal;
                    } else if (!minVal && maxVal) {
                        rangeConstraint += maxVal;
                    } else if (minVal && maxVal) {
                        rangeConstraint += minVal + ' ' + maxVal;
                    }
                } else if (minQualVal && maxQualVal) {
                    if (minQualVal === '>' || minQualVal === '<') {
                        rangeConstraint += minQualVal;
                    }
                    rangeConstraint += minVal + '..';
                    if (maxQualVal === '>' || maxQualVal === '<') {
                        rangeConstraint += minQualVal;
                    }
                    rangeConstraint += maxVal;
                }
                rangeConstraint += ')';
                break;
            case 'String':
                rangeConstraint = 'str(';

                if (!maxVal) {
                    rangeConstraint += '"' + minVal + '"';
                } else {
                    rangeConstraint += '"' + minVal + '" "' + maxVal + '"';
                }
                rangeConstraint += ')';
                break;
        }

        this.activeRange.additionalFields.rangeConstraint = rangeConstraint;
    }

    addNewRange() {
        const newRange = this.rangeService.getNewRange(this.activeAttribute);
        if (!this.ranges) {
            this.ranges = new SnomedResponseObject();
        }
        this.ranges.items.push(newRange);
        this.rangeService.setRanges(this.ranges);
        this.makeActiveRange(newRange);
    }

    getResults() {
        if (this.activeRange) {
            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
                this.results = data;
            });
        }
    }

    clearResults() {
        this.results = { items: [], total: '' };
    }

    setActives(domain, attribute, range) {
        this.domainService.setActiveDomain(domain);
        this.attributeService.setActiveAttribute(attribute);
        this.rangeService.setActiveRange(range);
    }

    ECLexpressionBuilder(expression: any, originalExpression?: any) {
        if (expression && !originalExpression) {
            return SnomedUtilityService.ECLexpressionBuilder(expression);
        }

        if (expression && originalExpression) {
            const current = SnomedUtilityService.ECLexpressionBuilder(expression);
            const original = SnomedUtilityService.ECLexpressionBuilder(originalExpression);
            return SnomedUtilityService.expressionComparator(current, original);
        }
    }
}
