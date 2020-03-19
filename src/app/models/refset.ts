export class RefSet {
    additionalFields: AdditionalFields;
    referencedComponentId: string;
    referencedComponent: ReferencedComponent;
    refsetId: string;
    memberId: string;
    moduleId: string;
    active: boolean;
    changed: boolean;
    deleted: boolean;
    errors: Error[];

    constructor(additonalFields: AdditionalFields,
                referencedComponentId: string,
                referencedComponent: ReferencedComponent,
                refsetId: string,
                changed: boolean,
                active: boolean,
                errors: Error[]) {
        this.additionalFields = additonalFields;
        this.referencedComponentId = referencedComponentId;
        this.referencedComponent = referencedComponent;
        this.refsetId = refsetId;
        this.moduleId = '900000000000012004';
        this.changed = true;
        this.active = true;
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

export class Error {
    message: string;
    fieldReference: string;

    constructor(message: string, fieldReference: string) {
        this.message = message;
        this.fieldReference = fieldReference;
    }
}
