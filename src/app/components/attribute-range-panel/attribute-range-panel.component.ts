import {Component, OnDestroy} from '@angular/core';
import {RefSet} from '../../models/refset';
import {TerminologyServerService} from '../../services/terminologyServer.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {RangeService} from '../../services/range.service';
import {DomainService} from '../../services/domain.service';
import {AttributeService} from '../../services/attribute.service';
import {MrcmmtService} from '../../services/mrcmmt.service';
import {EditService} from '../../services/edit.service';
import {UrlParamsService} from '../../services/url-params.service';
import {BranchingService} from '../../services/branching.service';
import {ModalService} from '../../services/modal.service';
import {SnomedUtilityService} from '../../services/snomedUtility.service';
import {SnomedResponseObject} from '../../models/snomedResponseObject';
import {debounceTime, switchMap} from 'rxjs/operators';
import {PathingService} from '../../services/pathing/pathing.service';

@Component({
    selector: 'app-attribute-range-panel',
    templateUrl: './attribute-range-panel.component.html',
    styleUrls: ['./attribute-range-panel.component.scss']
})
export class AttributeRangePanelComponent implements OnDestroy {

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
    activeBranch: any;
    activeBranchSubscription: Subscription;

    private searchSubject = new Subject<string>();
    readonly results$:Observable<any> = this.searchSubject.pipe(
        debounceTime(300),
        switchMap(text => {
            if (text && text.length > 2) {
                return this.terminologyService.getRangeConstraintsWithTerm(this.activeRange.additionalFields.rangeConstraint, text);
            } else {
                return this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint);
            }
        })
    );

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private terminologyService: TerminologyServerService,
                public mrcmmtService: MrcmmtService,
                private editService: EditService,
                private urlParamsService: UrlParamsService,
                private branchingService: BranchingService,
                public modalService: ModalService,
                private pathingService: PathingService) {
        this.rangeSubscription = this.rangeService.getRanges().subscribe(data => this.ranges = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            // this.clearResults();
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => {
            this.activeRange = data;
            this.urlParamsService.updateActiveRefsetParams(this.activeDomain, this.activeAttribute, data);
            this.getInitialResults();
        });
        this.activeBranchSubscription = this.pathingService.getActiveBranch().subscribe(data => this.activeBranch = data);
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

    searchResults(target: any) {
        this.searchSubject.next(target.value);
    }

    makeActiveRange(activeRange) {
        // this.clearResults();

        if (this.activeRange === activeRange) {
            this.rangeService.clearLatestReleaseActiveRange();
            this.rangeService.clearRanges();
            this.setActives(this.activeDomain, this.activeAttribute, null);
        } else {
            this.activeRange = activeRange;

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId,
                this.branchingService.getLatestReleaseBranchPath()).subscribe(ranges => {

                this.rangeService.setLatestReleaseActiveRange(ranges.items.find(item => {
                    return item.referencedComponentId === this.activeRange.referencedComponentId;
                }));
            });

            this.setActives(this.activeDomain, this.activeAttribute, this.activeRange);
            // this.getInitialResults();
            // this.getResults();
        }
    }

    validateEcl() {
        this.attributeRuleInvalid = false;
        if (this.activeRange.additionalFields.rangeConstraint.length) {
            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
                    this.activeRange.etlError = null;
                    if (data.items.length === 0) {
                        this.attributeRuleInvalid = true;
                    }
                },
                error => {
                    this.activeRange.etlError = error.error.message;
                });
            this.updateRange();
        }
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
        // this.clearResults();
    }

    updateAttribute() {
        this.updateRange();
        this.activeRange.additionalFields.rangeConstraint = this.mrcmmtService.concreteDomainParametersToRangeConstraint(this.activeRange);
    }

    updateAttributeType() {
        this.updateRange();
        if (this.activeRange.concreteDomainParameters.attributeType === 'String') {
            this.activeRange.additionalFields.rangeConstraint = 'str(\"*\")';
        }
        this.activeRange.concreteDomainParameters.displayRange = '';
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

    getInitialResults() {
        if (this.activeRange && !this.activeAttribute.concreteDomainAttribute && this.activeRange.additionalFields.rangeConstraint) {
            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(() => {
                this.searchResults('');
            });
        }
    }

    setActives(domain, attribute, activeRange) {
        this.domainService.setActiveDomain(domain);
        this.attributeService.setActiveAttribute(attribute);
        this.rangeService.setActiveRange(activeRange);
    }

    ECLexpressionBuilder(expression: any, originalExpression?: any): any {
        if (expression && !originalExpression) {
            return SnomedUtilityService.ECLexpressionBuilder(expression);
        }

        if (expression && originalExpression) {
            const current = SnomedUtilityService.ECLexpressionBuilder(expression);
            const original = SnomedUtilityService.ECLexpressionBuilder(originalExpression);
            return SnomedUtilityService.expressionComparator(current, original);
        }
    }

    extensionRefset(range): boolean {
        return !this.domainService.internationalModuleIds.find(item => item.conceptId === range.moduleId);
    }
}
