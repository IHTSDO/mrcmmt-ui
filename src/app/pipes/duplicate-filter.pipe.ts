import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duplicateFilter'
})
export class DuplicateFilterPipe implements PipeTransform {

    transform(items: any[], domainIdFilter): any[] {
        if (!items) {
            return [];
        }

        let response = [];

        if (!domainIdFilter) {
            const lookup = {};

            response = items.filter(item => {
                return !lookup[item['referencedComponentId']] && (lookup[item['referencedComponentId']] = true);
            });
        } else {
            response = items;
        }

        return response;
    }

}
