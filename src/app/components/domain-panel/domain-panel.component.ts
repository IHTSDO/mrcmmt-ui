import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RefSet } from '../../models/refset';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnInit {

    // bindings
    @Input() domains: RefSet[];
    @Input() activeAttribute: RefSet;
    @Input() activeDomain: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();

    // filter
    domainFilter: string;

    constructor() {
    }

    ngOnInit() {
        this.domains = [];
    }

    makeActiveDomain(domain) {
        if (this.activeDomain === domain) {
            this.activeDomain = null;
            this.activeDomainEmitter.emit(null);
        } else {
            this.activeDomain = domain;
            this.activeDomainEmitter.emit(domain);
        }
    }
}
