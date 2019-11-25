import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss']
})
export class ApplicableAttributesPanelComponent implements OnInit {

    // bindings
    @Input() attributes: RefSet[];
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();
    @Output() rangesEmitter = new EventEmitter();

    // filter
    attributeFilter: string;

    constructor(private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
        this.attributes = [];
    }

    makeActiveAttribute(attribute) {
        this.activeRangeEmitter.emit(null);

        if (this.activeAttribute === attribute) {
            this.activeAttribute = null;
            this.activeAttributeEmitter.emit(null);
            this.rangesEmitter.emit([]);
        } else {
            this.activeAttribute = attribute;
            this.activeAttributeEmitter.emit(this.activeAttribute);

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(ranges => {
                console.log('RANGES: ', ranges);
                this.rangesEmitter.emit(ranges);
            });
        }
    }
}
