export class Attribute {
    additionalFields: {
        domainId: string;
        grouped: string;
        attributeCardinality: string;
        attributeInGroupCardinality: string;
        contentTypeId: string;
        ruleStrengthId: string;
    };
    referencedComponentId: string;
    referencedComponent: {
        id: string;
        fsn: {
            term: string;
        }
    };
    memberId: string;
    changed: boolean;
}
