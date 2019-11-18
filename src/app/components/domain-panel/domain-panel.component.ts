import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RefSet } from '../../models/refset';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnInit {

    // domains
    @Input() domains: RefSet[];

    // filter
    domainFilter: string;
    @Input() attributeIdFilter: string;
    @Output() domainIdEmitter = new EventEmitter();

    // active items
    activeDomainId: number;

    constructor() {
    }

    ngOnInit() {
        this.domains = [];
    }

    matchedAttributes(id) {

        if (this.activeDomainId === id) {
            this.activeDomainId = null;
            this.domainIdEmitter.emit(null);
        } else {
            if (this.activeDomainId === null) {
                this.attributeIdFilter = null;
            }
            this.activeDomainId = id;
            this.domainIdEmitter.emit(id);
        }
    }

    connectedAttributes(id) {
        if (id.length > 0) {
            return id === this.attributeIdFilter;
        } else {

        }
    }
}
