import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';
import { AttributeService } from './attribute.service';
import { RangeService } from './range.service';
import { TerminologyServerService } from './terminologyServer.service';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';
import { UrlParamsService } from './url-params.service';
import { ConcreteDomainParameters } from '../models/refset';
import { Hierarchy } from '../models/hierarchy';

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

    concreteAttributeTypes = ['Decimal', 'Integer', 'String'];
    minimumQualifierValueFields = ['>', '>='];
    maximumQualifierValueFields = ['<', '<='];

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
            attributes = this.buildAttributeHierarchy(attributes);
            this.addConcreteDomainParameters();
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
                ranges.items.forEach(item => {
                    if (item.additionalFields.rangeConstraint.startsWith('dec')
                        || item.additionalFields.rangeConstraint.startsWith('int')
                        || item.additionalFields.rangeConstraint.startsWith('str')) {
                        this.rangeConstraintToConcreteDomainParameters(item);
                    }
                });
                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.rangeService.setRanges(ranges);

                const activeRange = ranges.items.find(result => {
                    return result.additionalFields.contentTypeId === this.urlParamsService.getRangeParam();
                });
                this.rangeService.setActiveRange(activeRange);
            });
        }
    }

    addConcreteDomainParameters() {
        const attributesWithConcreteDomains = this.attributeService.getAttributesWithConcreteDomains();
        this.attributeService.getAttributes().subscribe(attributes => {
            attributes?.items.forEach(attribute => {
                attributesWithConcreteDomains.forEach(item => {
                    if (attribute.referencedComponentId === item.conceptId) {
                        attribute.concreteDomainAttribute = true;
                    }
                });
            });
        });
    }

    parseNestedLevel(level, depth, parentId, attributes) {
        attributes.items.forEach(item => {
            if (item.referencedComponentId === level.conceptId) {
                item.additionalFields.depth = depth;
                item.additionalFields.parentId = parentId;
            }
        });
        if (level.children) {
            depth = depth += 1;
            level.children.forEach((item) => {
                this.parseNestedLevel(item, depth, level.conceptId, attributes);
            });
        }
    }

    buildAttributeHierarchy(attributes) {
        const response = this.attributeService.getAttributeHierarchy();
        const hierarchy = new Hierarchy;
        hierarchy.conceptId = response['conceptId'];
        hierarchy.children = response['children'];
        const depth = 0;
        if (hierarchy.children) {
            hierarchy.children.forEach((item) => {
                this.parseNestedLevel(item, depth, hierarchy.conceptId, attributes);
            });
        }
        attributes.items.forEach(item => {
            if (!item.additionalFields.depth) {
                item.additionalFields.depth = 1;
            }
        });
        return attributes;
    }

    getRuleStrength(id) {
        if (id) {
            return this.ruleStrengthFields.find(item => item.id === id).term;
        } else {
            return '';
        }
    }

    getContentType(id) {
        if (id) {
            return this.contentTypeFields.find(item => item.id === id).term;
        } else {
            return '';
        }
    }

    rangeConstraintToConcreteDomainParameters(range) {
        const rangeConstraint = range.additionalFields.rangeConstraint;
        range.concreteDomainParameters = new ConcreteDomainParameters();

        if (rangeConstraint.startsWith('dec')) {
            range.concreteDomainParameters.attributeType = 'Decimal';
            range.concreteDomainParameters.displayRange =
                rangeConstraint.substring(rangeConstraint.indexOf('(') + 1, rangeConstraint.indexOf(')'));
        } else if (rangeConstraint.startsWith('int')) {
            range.concreteDomainParameters.attributeType = 'Integer';
            range.concreteDomainParameters.displayRange =
                rangeConstraint.substring(rangeConstraint.indexOf('(') + 1, rangeConstraint.indexOf(')'));
        } else if (rangeConstraint.startsWith('str')) {
            range.concreteDomainParameters.attributeType = 'String';
            range.concreteDomainParameters.displayRange =
                rangeConstraint.substring(rangeConstraint.indexOf('("') + 2, rangeConstraint.indexOf('")'));
        }
    }

    concreteDomainParametersToRangeConstraint(range) {
        switch (range.concreteDomainParameters.attributeType) {
            case 'Decimal':
                range.additionalFields.rangeConstraint = 'dec(';
                range.additionalFields.rangeConstraint += range.concreteDomainParameters.displayRange;
                range.additionalFields.rangeConstraint += ')';
                break;
            case 'Integer':
                range.additionalFields.rangeConstraint = 'int(';
                range.additionalFields.rangeConstraint += range.concreteDomainParameters.displayRange;
                range.additionalFields.rangeConstraint += ')';
                break;
            case 'String':
                range.additionalFields.rangeConstraint = 'str("';
                range.additionalFields.rangeConstraint += range.concreteDomainParameters.displayRange;
                range.additionalFields.rangeConstraint += '")';
        }

        return range.additionalFields.rangeConstraint;
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
        this.terminologyService.getDomains().subscribe(domains => {
            this.domainService.setDomains(domains);
        });
        this.terminologyService.getAttributes().subscribe(attributes => {
            attributes = this.buildAttributeHierarchy(attributes);
            this.addConcreteDomainParameters();
            this.attributeService.setAttributes(attributes);
        });
    }
}
