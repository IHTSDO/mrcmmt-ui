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

    // filter
    attributeFilter: string;
    @Input() domainIdFilter: string;
    @Output() attributeIdEmitter = new EventEmitter();

    // active items
    activeAttributeId: number;

    constructor() {
    }

    ngOnInit() {
        this.attributes = [];
    }

    matchedDomain(id, refId) {
        this.attributeIdEmitter.emit(id);

        if (this.activeAttributeId === refId) {
            this.activeAttributeId = null;
            this.attributeIdEmitter.emit(null);
        } else {
            this.activeAttributeId = refId;
            this.attributeIdEmitter.emit(id);
        }
    }
}
