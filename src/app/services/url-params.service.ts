import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UrlParamsService {

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    getDomainParam() {
        return this.route.snapshot.queryParamMap.get('domain');
    }

    getAttributeParam() {
        return this.route.snapshot.queryParamMap.get('attribute');
    }

    getRangeParam() {
        return this.route.snapshot.queryParamMap.get('range');
    }

    getBranchParam() {
        return this.route.snapshot.queryParamMap.get('branch');
    }

    updateActiveRefsetParams(domain, attribute, range) {
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

    updateBranchParam(branch) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {branch: branch},
                queryParamsHandling: 'merge'
            });
    }
}
