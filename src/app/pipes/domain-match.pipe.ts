import { Pipe, PipeTransform } from '@angular/core';
import { RefSet } from '../models/refset';

@Pipe({
    name: 'domainMatch'
})
export class DomainMatchPipe implements PipeTransform {

    transform(items: any[], domain: RefSet): any {
        if (!items) {
            return [];
        }
        if (!domain) {
            return items;
        }

        items = items.filter(item => {
            return item.additionalFields.domainId === domain.referencedComponentId;
        });

        return items;
    }
}
