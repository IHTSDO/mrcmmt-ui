import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { Subscription } from 'rxjs';
import { RangeService } from '../../services/range.service';

@Component({
    selector: 'app-attribute-range-panel',
    templateUrl: './attribute-range-panel.component.html',
    styleUrls: ['./attribute-range-panel.component.scss']
})
export class AttributeRangePanelComponent implements OnChanges, OnDestroy {

    // bindings
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();

    // results
    results: any[];
    total: any;

    // visibility flags
    rangeConstraint: boolean;
    attributeRule: boolean;

    ranges: object;
    rangeSubscription: Subscription;

    constructor(private terminologyService: TerminologyServerService, private rangeService: RangeService) {
        this.rangeSubscription = this.rangeService.collectRanges().subscribe(data => {
            this.ranges = data;
        });
    }

    ngOnChanges() {
        this.results = [];
        this.total = '';
        this.rangeConstraint = true;
        this.attributeRule = true;

        if (this.activeRange) {
            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
                this.total = data.total;
                this.results = data.items;
            });
        } else {
            this.results = [];
        }
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.rangeSubscription.unsubscribe();
    }

    makeActiveRange(range) {
        if (this.activeRange === range) {
            this.setActives(this.activeDomain, this.activeAttribute, null);
            this.results = [];
            this.total = '';
        } else {
            this.activeRange = range;
            this.setActives(this.activeDomain, this.activeAttribute, range);

            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
                this.total = data.total;
                this.results = data.items;
            });
        }
    }

    setActives(domain, attribute, range) {
        this.activeDomainEmitter.emit(domain);
        this.activeAttributeEmitter.emit(attribute);
        this.activeRangeEmitter.emit(range);
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
