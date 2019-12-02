import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RefSet } from '../../models/refset';

@Component({
    selector: 'app-breadcrumb-bar',
    templateUrl: './breadcrumb-bar.component.html',
    styleUrls: ['./breadcrumb-bar.component.scss']
})
export class BreadcrumbBarComponent implements OnInit {

    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() activeRange: RefSet;
    @Output() resetEmitter = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    determineContentTypeField(id) {
        switch (id) {
            case '723596005': {
                return 'All SNOMED CT content (foundation metadata concept)';
            }
            case '723593002': {
                return 'All new precoordinated SNOMED CT content (foundation metadata concept)';
            }
            case '723594008': {
                return 'All precoordinated SNOMED CT content (foundation metadata concept)';
            }
            case '723595009': {
                return 'All postcoordinated SNOMED CT content (foundation metadata concept)';
            }
        }
    }
}
