import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RefSet } from '../../models/refset';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss']
})
export class ApplicableAttributesPanelComponent implements OnInit {

    // domains
    @Input() attributes: RefSet[];
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Output() activeAttributeEmitter = new EventEmitter();

    // filter
    attributeFilter: string;

    constructor() {
    }

    ngOnInit() {
        this.attributes = [];
    }

    makeActiveAttribute(attribute) {
        if (attribute === this.activeAttribute) {
            this.activeAttribute = null;
            this.activeAttributeEmitter.emit(null);
        } else {
            this.activeAttribute = attribute;
            this.activeAttributeEmitter.emit(this.activeAttribute);
        }
    }
}
