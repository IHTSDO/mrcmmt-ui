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
    @Input() activeAttributes: RefSet[];
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() activeAttributesEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();
    @Output() rangesEmitter = new EventEmitter();

    // filter
    attributeFilter: string;

    constructor(private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
        this.attributes = [];
        this.activeAttributes = [];
    }

    makeActiveAttribute(attribute) {
        let activeAttributes = [];
        this.activeRangeEmitter.emit(null);

        if (this.activeAttribute === attribute) {
            this.setActives(this.activeDomain, null, null, null);
            this.rangesEmitter.emit([]);
        } else {
            this.activeAttribute = attribute;
            activeAttributes.push(attribute);
            this.attributes.forEach((item) => {
                if(this.activeAttribute.memberId !== item.memberId && this.activeAttribute.referencedComponentId === item.referencedComponentId){
                    activeAttributes.push(item);  
                }
            });
            
            this.activeAttributes = activeAttributes;
            
            this.setActives(this.activeDomain, attribute, null, this.activeAttributes);

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(ranges => {
                console.log('RANGES: ', ranges);
                this.setActives(this.activeDomain, attribute, ranges[0], this.activeAttributes);
                this.rangesEmitter.emit(ranges);

                // if (ranges) {
                //     this.activeRangeEmitter.emit(ranges[0]);
                // }
            });
        }
    }

    setActives(domain, attribute, range, attributes) {
        this.activeDomainEmitter.emit(domain);
        this.activeAttributeEmitter.emit(attribute);
        this.activeAttributesEmitter.emit(attributes);
        this.activeRangeEmitter.emit(range);
    }

    determineMandatoryField(id) {
        switch (id) {
            case '723597001': {
                return 'Mandatory concept model rule (foundation metadata concept)';
            }
            case '723598006': {
                return 'Optional concept model rule (foundation metadata concept)';
            }
        }
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
