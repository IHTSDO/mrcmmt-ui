import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idMatch'
})
export class IdMatchPipe implements PipeTransform {

    transform(items: any[], text: string): any[] {
        console.log('text: ', text);

        if (!items) {
            return [];
        }
        if (!text) {
            return items;
        }

        const response = items.filter(item => {
            if (item.additionalFields.domainId) {
                return item.additionalFields.domainId === text;
            } else {
                return item.referencedComponentId === text;
            }
        });

        console.log('ITEMS: ', items);
        console.log('RESPONSE: ', response);
        return response;
    }
}
