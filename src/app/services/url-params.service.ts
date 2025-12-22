import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UrlParamsService {

    private suppressUrlUpdate = false;
    private restoringFromUrl = false;

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    startRestore(): void {
        this.restoringFromUrl = true;
        this.suppressUrlUpdate = true;
    }

    endRestore(): void {
        this.restoringFromUrl = false;
        this.suppressUrlUpdate = false;
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
        if (this.suppressUrlUpdate || this.restoringFromUrl) {
            return;
        }

        const params: any = {
            branch: this.getBranchParam()
        };

        if (domain && !attribute && !range) {
            params.domain = domain.referencedComponentId;
            params.attribute = null;
            params.range = null;
        }

        else if (attribute && !range) {
            params.domain =
                domain?.referencedComponentId ?? this.getDomainParam();
            params.attribute = attribute.referencedComponentId;
            params.range = null;
        }

        else if (domain && attribute && range && range.additionalFields) {
            params.domain = domain.referencedComponentId;
            params.attribute = attribute.referencedComponentId;
            params.range = range.additionalFields.contentTypeId;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    updateBranchParam(branch) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { branch: branch }
            });
    }

    clearDeepLinkParams(): void {

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                domain: null,
                attribute: null,
                range: null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

}
