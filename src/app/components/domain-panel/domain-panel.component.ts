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

    constructor() {
    }

    ngOnInit() {
        this.domains = [];
    }

    matchedReferenceSets(id) {
        this.domainIdEmitter.emit(id);
    }
}
