import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idMatch'
})
export class IdMatchPipe implements PipeTransform {

    transform(items: any[], text: string): any[] {
        if (!items) {
            return [];
        }
        if (!text) {
            return items;
        }

        items = items.filter(item => {
            if (item.additionalFields.domainId) {
                return item.additionalFields.domainId === text;
            } else {
                return item.referencedComponentId === text;
            }
        });

        return items;
    }
}
