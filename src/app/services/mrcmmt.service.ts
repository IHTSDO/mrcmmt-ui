import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainService } from './domain.service';
import { AttributeService } from './attribute.service';
import { RangeService } from './range.service';
import { TerminologyServerService } from './terminologyServer.service';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';

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

    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private terminologyService: TerminologyServerService, private router: Router, private route: ActivatedRoute,
                private customOrder: CustomOrderPipe) {
    }

    queryStringParameterSetter(domain, attribute, range) {
        const params = {};

        if (domain) {
            params['domain'] = domain.referencedComponentId;
        }

        if (attribute) {
            params['attribute'] = attribute.referencedComponentId;
        }

        if (range) {
            params['range'] = range.additionalFields.contentTypeId;
        }

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge'
            });
    }

    setupDomains() {
        this.terminologyService.getDomains().subscribe(domains => {
            this.domainService.setDomains(domains);

            if (this.route.snapshot.queryParamMap.get('domain')) {
                const activeDomain = domains.items.find(result => {
                    return result.referencedComponentId === this.route.snapshot.queryParamMap.get('domain');
                });
                this.domainService.setActiveDomain(activeDomain);
            }
        });
        this.setupAttributes();
    }

    setupAttributes() {
        this.terminologyService.getAttributes().subscribe(attributes => {
            this.attributeService.setAttributes(attributes);

            if (this.route.snapshot.queryParamMap.get('attribute')) {
                const activeAttribute = attributes.items.find(result => {
                    return result.referencedComponentId === this.route.snapshot.queryParamMap.get('attribute');
                });
                this.attributeService.setActiveAttribute(activeAttribute);
                this.setupRanges(activeAttribute);
            }
        });
    }

    setupRanges(activeAttribute) {
        if (this.route.snapshot.queryParamMap.get('range')) {
            this.terminologyService.getRanges(activeAttribute.referencedComponentId).subscribe(ranges => {
                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.rangeService.setRanges(ranges);

                const activeRange = ranges.items.find(result => {
                    return result.additionalFields.contentTypeId === this.route.snapshot.queryParamMap.get('range');
                });
                this.rangeService.setActiveRange(activeRange);
            });
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
