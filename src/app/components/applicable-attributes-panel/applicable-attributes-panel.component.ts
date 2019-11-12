import { Component, Input, OnInit } from '@angular/core';
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

    constructor() {
    }

    ngOnInit() {
        this.attributes = [];
    }
}
