import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { Subscription } from 'rxjs';
import { RangeService } from '../../services/range.service';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { MrcmmtService } from '../../services/mrcmmt.service';

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

    ranges: object;
    rangeSubscription: Subscription;
    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;

    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private terminologyService: TerminologyServerService, private mrcmmtService: MrcmmtService) {
        this.rangeSubscription = this.rangeService.getRanges().subscribe(data => this.ranges = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.clearResults();
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => {
            this.activeRange = data;
            this.mrcmmtService.queryStringParameterSetter(this.activeDomain, this.activeAttribute, data);
            this.getResults();
        });
    }

    ngOnDestroy() {
        this.rangeSubscription.unsubscribe();
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
    }

    makeActiveRange(range) {
        if (this.activeRange === range) {
            this.setActives(this.activeDomain, this.activeAttribute, null);
            this.clearResults();
        } else {
            this.activeRange = range;
            this.setActives(this.activeDomain, this.activeAttribute, this.activeRange);
            this.getResults();
        }
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
