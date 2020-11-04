import { Guid } from 'guid-typescript';

export class RefSet {
    additionalFields: AdditionalFields;
    referencedComponentId: string;
    referencedComponent: ReferencedComponent;
    refsetId: string;
    memberId: string;
    moduleId: string;
    active: boolean;
    newRefset: boolean;
    changed: boolean;
    deleted: boolean;
    errors: RefsetError[];
    concreteDomainAttribute?: boolean;
    concreteDomainParameters?: ConcreteDomainParameters;

    constructor(additonalFields: AdditionalFields,
                referencedComponentId: string,
                referencedComponent: ReferencedComponent,
                refsetId: string,
                changed: boolean,
                active: boolean,
                errors: RefsetError[]) {
        this.additionalFields = additonalFields;
        this.referencedComponentId = referencedComponentId;
        this.referencedComponent = referencedComponent;
        this.refsetId = refsetId;
        this.memberId = Guid.create().toString();
        this.moduleId = '900000000000012004';
        this.changed = true;
        this.active = true;
        this.newRefset = true;
        this.errors = errors;
    }
}

export class AdditionalFields {
    domainId: string;
    domainConstraint: string;
    parentDomain: string;
    proximalPrimitiveConstraint: string;
    proximalPrimitiveRefinement: string;
    domainTemplateForPrecoordination: string;
    domainTemplateForPostcoordination: string;
    grouped: string;
    attributeCardinality: string;
    attributeInGroupCardinality: string;
    contentTypeId: string;
    ruleStrengthId: string;
    rangeConstraint: string;
    attributeRule: string;
    guideURL: string;

    constructor(domainId: string) {
        this.domainId = domainId;
    }
}

export class ReferencedComponent {
    id: string;
    fsn: {
        term: string
    };
}

export class RefsetError {
    message: string;
    fieldReference: string;

    constructor(message: string, fieldReference: string) {
        this.message = message;
        this.fieldReference = fieldReference;
    }
}

export class ConcreteDomainParameters {
    attributeType: string;
    minimumQualifierValue: string;
    minimumValue: string;
    maximumQualifierValue: string;
    maximumValue: string;

    constructor() {
        this.attributeType = 'Decimal';
        this.minimumQualifierValue = '>';
        this.minimumValue = '';
        this.maximumQualifierValue = '<';
        this.maximumValue = '';
    }
}
