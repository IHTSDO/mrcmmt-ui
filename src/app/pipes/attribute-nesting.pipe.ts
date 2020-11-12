import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'attributeNesting'
})
export class AttributeNestingPipe implements PipeTransform {

    transform(items: any[]): any[] {
        const orderedItems = [];
        for (let i = items.length - 1; i > 0; i--) {
            if (items[i].additionalFields.depth === 1) {
                orderedItems.unshift(items[i]);
                items.splice(i, 1);
            }
        }
        for (let i = items.length - 1; i > 0; i--) {
            for (let j = 0;  j < orderedItems.length; j++) {
                if (items[i].additionalFields.parentId === orderedItems[j].referencedComponentId) {
                    orderedItems.splice(j + 1, 0, items[i]);
                }
            }
        }
        return orderedItems;
    }
}
