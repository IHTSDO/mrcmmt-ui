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
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();

    // filter
    domainFilter: string;

    // visibility flags
    preCoordination: boolean;
    postCoordination: boolean;


    constructor() {
    }

    ngOnInit() {
        this.domains = [];
        this.preCoordination = true;
        this.postCoordination = true;
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
