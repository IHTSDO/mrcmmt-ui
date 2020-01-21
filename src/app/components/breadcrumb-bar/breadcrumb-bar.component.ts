import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-breadcrumb-bar',
    templateUrl: './breadcrumb-bar.component.html',
    styleUrls: ['./breadcrumb-bar.component.scss']
})
export class BreadcrumbBarComponent implements OnDestroy {

    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;

    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService) {
        this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
        this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => this.activeAttribute = data);
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
    }

    reset() {
        this.attributeService.clearActiveAttribute();
        this.domainService.clearActiveDomain();
        this.rangeService.clearActiveRange();
        this.rangeService.clearRanges();
        this.attributeService.clearMatchedDomains();
        this.domainService.clearDomainFilter();
        this.attributeService.clearAttributeFilter();
    }

    ngOnDestroy() {
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
    }

    determineContentTypeField(id) {
        switch (id) {
            case '723596005': {
                return 'All SNOMED CT content (foundation metadata concept)';
            }
            case '723593002': {
                return 'All new precoordinated SNOMED CT content (foundation metadata concept)';
            }
            case '723594008': {
                return 'All precoordinated SNOMED CT content (foundation metadata concept)';
            }
            case '723595009': {
                return 'All postcoordinated SNOMED CT content (foundation metadata concept)';
            }
        }
    }
}
