import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { Subscription } from 'rxjs';
import { RangeService } from '../../services/range.service';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';

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

    ranges: object;
    rangeSubscription: Subscription;

    results: Results;

    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;

    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private terminologyService: TerminologyServerService) {
        this.rangeSubscription = this.rangeService.getRanges().subscribe(data => this.ranges = data);
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => {
            this.activeAttribute = data;
            this.clearResults();
        });
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => {
            this.activeRange = data;
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

    determineMandatoryField(id) {
        switch (id) {
            case '723597001': {
                return 'Mandatory concept model rule';
            }
            case '723598006': {
                return 'Optional concept model rule';
            }
        }
    }

    determineContentTypeField(id) {
        switch (id) {
            case '723596005': {
                return 'All SNOMED CT content';
            }
            case '723593002': {
                return 'All new precoordinated SNOMED CT content';
            }
            case '723594008': {
                return 'All precoordinated SNOMED CT content';
            }
            case '723595009': {
                return 'All postcoordinated SNOMED CT content';
            }
        }
    }
}
