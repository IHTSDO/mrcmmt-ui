import { Injectable } from '@angular/core';
import { DomainService } from './domain.service';
import { AttributeService } from './attribute.service';
import { RangeService } from './range.service';
import { TerminologyServerService } from './terminologyServer.service';
import { CustomOrderPipe } from '../pipes/custom-order.pipe';
import { UrlParamsService } from './url-params.service';
import { ConcreteDomainParameters } from '../models/refset';

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
            this.attributeService.setAttributes(attributes);
            this.addConcreteDomainParameters();

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
            attributes.items.forEach(attribute => {
                attributesWithConcreteDomains.forEach(item => {
                    if (attribute.referencedComponentId === item.conceptId) {
                        attribute.concreteDomainAttribute = true;
                    }
                });
            });
        });
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
        let rangeConstraint = range.additionalFields.rangeConstraint;
        range.concreteDomainParameters = new ConcreteDomainParameters();

        if (rangeConstraint.startsWith('dec')) {
            range.concreteDomainParameters.attributeType = 'Decimal';
            rangeConstraint = rangeConstraint.substring(rangeConstraint.indexOf('(') + 1, rangeConstraint.length);

            if (rangeConstraint.startsWith('>')) {
                range.concreteDomainParameters.minimumQualifierValue = '>';
                rangeConstraint = rangeConstraint.substring(1, rangeConstraint.length);
            } else {
                range.concreteDomainParameters.minimumQualifierValue = '>=';
            }
            range.concreteDomainParameters.minimumValue = rangeConstraint.substring(1, rangeConstraint.indexOf('.'));

        } else if (rangeConstraint.startsWith('int')) {
            range.concreteDomainParameters.attributeType = 'Integer';
            rangeConstraint = rangeConstraint.substring(rangeConstraint.indexOf('(') + 1, rangeConstraint.length);

            if (rangeConstraint.startsWith('>')) {
                range.concreteDomainParameters.minimumQualifierValue = '>';
                rangeConstraint = rangeConstraint.substring(1, rangeConstraint.length);
            } else {
                range.concreteDomainParameters.minimumQualifierValue = '>=';
            }

            range.concreteDomainParameters.minimumValue = rangeConstraint.substring(1, rangeConstraint.indexOf('..'));
            rangeConstraint = rangeConstraint.substring(rangeConstraint.indexOf('..') + 1, rangeConstraint.length);

            if (rangeConstraint.startsWith('<')) {
                range.concreteDomainParameters.maximumQualifierValue = '<';
                rangeConstraint = rangeConstraint.substring(1, rangeConstraint.length);
            } else {
                range.concreteDomainParameters.maximumQualifierValue = '<=';
            }

            range.concreteDomainParameters.maximumValue = rangeConstraint.substring(rangeConstraint.indexOf('#') + 1, rangeConstraint.indexOf(')'));
        } else if (rangeConstraint.startsWith('str')) {
            range.concreteDomainParameters.attributeType = 'String';
            rangeConstraint = rangeConstraint.substring(rangeConstraint.indexOf('"') + 1, rangeConstraint.length);
            range.concreteDomainParameters.minimumValue = rangeConstraint.substring(0, rangeConstraint.indexOf('"'));

            if (rangeConstraint.includes(' ')) {
                rangeConstraint = rangeConstraint.substring(rangeConstraint.indexOf(' "') + 1, rangeConstraint.length);
                range.concreteDomainParameters.maximumValue = rangeConstraint.substring(1, rangeConstraint.indexOf('")'));
            }
        }

        console.log('params: ', range.concreteDomainParameters);
    }

    concreteDomainParametersToRangeConstraint(range) {
        const minQualVal = range.concreteDomainParameters.minimumQualifierValue;
        const minVal = range.concreteDomainParameters.minimumValue;
        const maxQualVal = range.concreteDomainParameters.maximumQualifierValue;
        const maxVal = range.concreteDomainParameters.maximumValue;
        let rangeConstraint = range.additionalFields.rangeConstraint;

        switch (range.concreteDomainParameters.attributeType) {
            case 'Decimal':
                rangeConstraint = 'dec(';

                if (minQualVal === '>') {
                    rangeConstraint += minQualVal;
                    rangeConstraint += '>#' + minVal;
                } else {
                    rangeConstraint += '#' + minVal;
                }

                rangeConstraint += '..)';
                break;
            case 'Integer':
                rangeConstraint = 'int(';

                if (!minQualVal && !maxQualVal) {
                    if (minVal && !maxVal) {
                        rangeConstraint += '#' + minVal;
                    } else if (!minVal && maxVal) {
                        rangeConstraint += '#' + maxVal;
                    } else if (minVal && maxVal) {
                        rangeConstraint += '#' + minVal + ' #' + maxVal;
                    }
                } else if (minQualVal && maxQualVal) {
                    if (minQualVal === '>') {
                        rangeConstraint += minQualVal;
                    }
                    rangeConstraint += '#' + minVal + '..';
                    if (maxQualVal === '<') {
                        rangeConstraint += minQualVal;
                    }
                    rangeConstraint += '#' + maxVal;
                }
                rangeConstraint += ')';
                break;
            case 'String':
                rangeConstraint = 'str(';

                if (!maxVal) {
                    rangeConstraint += '"' + minVal + '"';
                } else {
                    rangeConstraint += '"' + minVal + '" "' + maxVal + '"';
                }
                rangeConstraint += ')';
                break;
        }

        return rangeConstraint;
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
            this.attributeService.setAttributes(attributes);
        });
    }
}
