import { Pipe, PipeTransform } from '@angular/core';
import { RefSet } from '../models/refset';
import { SnomedUtilityService } from '../services/snomedUtility.service';

@Pipe({
    name: 'inheritedDomainMatch'
})
export class InheritedDomainMatchPipe implements PipeTransform {

    transform(items: any[], activeDomain: RefSet, domains: RefSet[]): any {
        if (!items) {
            return [];
        }
        if (!activeDomain) {
            return items;
        }

        const response = [];

        if (activeDomain.additionalFields.parentDomain) {
            domains.forEach(domain => {
                const parentDomain = activeDomain.additionalFields.parentDomain;

                if (domain.referencedComponentId === SnomedUtilityService.getIdFromShortConcept(parentDomain)) {
                    const innerParentDomain = domain.additionalFields.parentDomain;

                    items.forEach(item => {
                        if (item.additionalFields.domainId === domain.referencedComponentId) {
                            if (domain.additionalFields.parentDomain) {
                                items.forEach(item2 => {
                                    if (item2.additionalFields.domainId === SnomedUtilityService.getIdFromShortConcept(innerParentDomain)) {
                                        response.push(item2);
                                    }
                                });
                            }
                            response.push(item);
                        }
                    });
                }
            });
        }

        return response;
    }
}
