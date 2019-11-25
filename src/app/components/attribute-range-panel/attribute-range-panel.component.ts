import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';

@Component({
    selector: 'app-attribute-range-panel',
    templateUrl: './attribute-range-panel.component.html',
    styleUrls: ['./attribute-range-panel.component.scss']
})
export class AttributeRangePanelComponent implements OnInit {

    // bindings
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() activeRange: RefSet;
    @Input() ranges: RefSet[];
    @Output() activeRangeEmitter = new EventEmitter();

    // results
    results: any[];

    constructor(private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
    }

    makeActiveRange(range) {
        if (this.activeRange === range) {
            this.activeRange = null;
            this.activeRangeEmitter.emit(null);
            this.results = [];
        } else {
            this.activeRange = range;
            this.activeRangeEmitter.emit(range);

            this.terminologyService.getRangeConstraints(this.activeRange.additionalFields.rangeConstraint).subscribe(data => {
                this.results = data;
            });
        }
    }
}
