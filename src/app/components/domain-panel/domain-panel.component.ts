import { Component, Input, OnInit } from '@angular/core';
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

    constructor() {
    }

    ngOnInit() {
        this.domains = [];
    }
}
