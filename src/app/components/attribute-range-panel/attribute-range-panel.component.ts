import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { Subscription } from 'rxjs';
import { RangeService } from '../../services/range.service';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { EditService } from '../../services/edit.service';
import { UrlParamsService } from '../../services/url-params.service';
import { BranchingService } from '../../services/branching.service';

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

    rangeConstraint: boolean;
    attributeRule: boolean;
    results: Results;
    attributeRuleInvalid: boolean;

    latestReleaseRange: RefSet;
    latestReleaseRangeSubscription: Subscription;
    ranges: object;
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
                private mrcmmtService: MrcmmtService,
                private editService: EditService,
                private urlParamsService: UrlParamsService,
                private branchingService: BranchingService) {
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

    addNewRange() {
        const newRange = this.rangeService.getNewRange(this.activeAttribute);
        this.ranges['items'].push(newRange);
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
}
