import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

    constructor(private router: Router, private route: ActivatedRoute) {
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
