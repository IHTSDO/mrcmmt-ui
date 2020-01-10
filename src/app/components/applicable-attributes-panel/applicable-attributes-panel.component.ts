import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RefSet } from '../../models/refset';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss'],
    providers: [ CustomOrderPipe ]
})
export class ApplicableAttributesPanelComponent implements OnInit {

    // bindings
    @Input() attributes: RefSet[];
    @Input() domains: RefSet[];
    @Input() activeDomain: RefSet;
    @Input() activeAttribute: RefSet;
    @Input() attributeMatchedDomains: RefSet[];
    @Input() activeRange: RefSet;
    @Output() activeDomainEmitter = new EventEmitter();
    @Output() activeAttributeEmitter = new EventEmitter();
    @Output() attributeMatchedDomainsEmitter = new EventEmitter();
    @Output() activeRangeEmitter = new EventEmitter();
    @Output() rangesEmitter = new EventEmitter();

    // filter
    attributeFilter: string;

    // visibility flags
    detailsExpanded: boolean;

    constructor(private terminologyService: TerminologyServerService, private customOrder: CustomOrderPipe) {
    }

    ngOnInit() {
        this.attributes = [];
        this.attributeMatchedDomains = [];
        this.detailsExpanded = true;
    }

    makeActiveAttribute(attribute) {
        const attributeMatchedDomains = [];
        this.activeRangeEmitter.emit(null);

        if (this.activeAttribute === attribute) {
            this.detailsExpanded = true;
            this.setActives(this.activeDomain, null, null, null);
            this.rangesEmitter.emit([]);
        } else {
            this.attributeMatchedDomains = [];
            this.activeAttribute = attribute;
            attributeMatchedDomains.push(attribute);
            this.attributes.forEach((item) => {
                if (this.activeAttribute.memberId !== item.memberId &&
                    this.activeAttribute.referencedComponentId === item.referencedComponentId) {
                    attributeMatchedDomains.push(item);
                }
            });

            this.attributeMatchedDomains = attributeMatchedDomains;

            this.automaticDomainSelect();
            this.setActives(this.activeDomain, attribute, null, this.attributeMatchedDomains);

            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(ranges => {
                console.log('RANGES: ', ranges);
                ranges = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.setActives(this.activeDomain, attribute, ranges[0], this.attributeMatchedDomains);
                this.rangesEmitter.emit(ranges);
            });
        }
    }

    setActives(domain, attribute, range, attributes) {
        this.activeDomainEmitter.emit(domain);
        this.activeAttributeEmitter.emit(attribute);
        this.activeRangeEmitter.emit(range);
        this.attributeMatchedDomainsEmitter.emit(attributes);
    }

    automaticDomainSelect() {
        if (!this.activeDomain) {
            const activeDomainList = [];

            for (let i = 0; i < this.domains.length; i++) {
                for (let j = 0; j < this.attributeMatchedDomains.length; j++) {
                    if (this.domains[i].referencedComponentId === this.attributeMatchedDomains[j].additionalFields.domainId) {
                        activeDomainList.push(this.domains[i]);
                    }
                }
            }

            this.activeDomain = activeDomainList[0];
        }
    }

    determineMandatoryField(id) {
        switch (id) {
            case '723597001': {
                return 'Mandatory concept model rule';
            }
            case '723598006': {
                return 'Optional concept model rule';
            }
        }
    }

    determineContentTypeField(id) {
        switch (id) {
            case '723596005': {
                return 'All SNOMED CT content';
            }
            case '723593002': {
                return 'All new precoordinated SNOMED CT content';
            }
            case '723594008': {
                return 'All precoordinated SNOMED CT content';
            }
            case '723595009': {
                return 'All postcoordinated SNOMED CT content';
            }
        }
    }
}
