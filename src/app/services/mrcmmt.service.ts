import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';
import { AttributeService } from './attribute.service';
import { RangeService } from './range.service';
import { TerminologyServerService } from './terminologyServer.service';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';
import { UrlParamsService } from './url-params.service';

@Injectable({
    providedIn: 'root'
})
export class MrcmmtService {

    ruleStrengthFields = [
        {
            id: '723597001',
            term: 'Mandatory concept model rule'
        },
        {
            id: '723598006',
            term: 'Optional concept model rule'
        }
    ];

    contentTypeFields = [
        {
            id: '723596005',
            term: 'All SNOMED CT content'
        },
        {
            id: '723593002',
            term: 'All new precoordinated SNOMED CT content'
        },
        {
            id: '723594008',
            term: 'All precoordinated SNOMED CT content'
        },
        {
            id: '723595009',
            term: 'All postcoordinated SNOMED CT content'
        }
    ];

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private terminologyService: TerminologyServerService,
                private customOrder: CustomOrderPipe,
                private urlParamsService: UrlParamsService) {
    }

    setupDomains() {
        this.terminologyService.getDomains().subscribe(domains => {
            this.domainService.setDomains(domains);

            if (this.urlParamsService.getDomainParam()) {
                const activeDomain = domains.items.find(result => {
                    return result.referencedComponentId === this.urlParamsService.getDomainParam();
                });
                this.domainService.setActiveDomain(activeDomain);
            }
        });
        this.setupAttributes();
    }

    setupAttributes() {
        this.terminologyService.getAttributes().subscribe(attributes => {
            this.attributeService.setAttributes(attributes);

            if (this.urlParamsService.getAttributeParam()) {
                const activeAttribute = attributes.items.find(result => {
                    return result.referencedComponentId === this.urlParamsService.getAttributeParam();
                });
                this.attributeService.setActiveAttribute(activeAttribute);
                this.setupRanges(activeAttribute);
            }
        });
    }

    setupRanges(activeAttribute) {
        if (this.urlParamsService.getRangeParam()) {
            this.terminologyService.getRanges(activeAttribute.referencedComponentId).subscribe(ranges => {
                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.rangeService.setRanges(ranges);

                const activeRange = ranges.items.find(result => {
                    return result.additionalFields.contentTypeId === this.urlParamsService.getRangeParam();
                });
                this.rangeService.setActiveRange(activeRange);
            });
        }
    }

    getRuleStrength(id) {
        if (id !== '') {
            return this.ruleStrengthFields.find(item => item.id === id).term;
        } else {
            return '';
        }
    }

    getContentType(id) {
        if (id !== '') {
            return this.contentTypeFields.find(item => item.id === id).term;
        } else {
            return '';
        }
    }

    resetTool() {
        this.attributeService.clearActiveAttribute();
        this.domainService.clearActiveDomain();
        this.rangeService.clearActiveRange();
        this.rangeService.clearRanges();
        this.attributeService.clearMatchedDomains();
        this.domainService.clearDomainFilter();
        this.attributeService.clearAttributeFilter();
        this.urlParamsService.updateActiveRefsetParams(null, null, null);
        this.setupDomains();
    }
}
