import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duplicateFilter'
})
export class DuplicateFilterPipe implements PipeTransform {

    transform(items: any[], domainIdFilter): any[] {
        if (!items) {
            return [];
        }

        // console.log('BEFORE: ', items);

        let response = [];

        if (!domainIdFilter) {
            const lookup = {};

            response = items.filter(item => {
                return !lookup[item['referencedComponentId']] && (lookup[item['referencedComponentId']] = true);
            });
        } else {
            response = items;
        }

        // console.log('AFTER: ', response);

        return response;
    }

}
