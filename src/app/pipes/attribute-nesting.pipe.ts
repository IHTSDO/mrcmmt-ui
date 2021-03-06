import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'attributeNesting'
})
export class AttributeNestingPipe implements PipeTransform {

    transform(items: any[]): any[] {
        const orderedItems = [];
        let found = false;
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].additionalFields.depth === 1) {
                orderedItems.unshift(items[i]);
                items.splice(i, 1);
            }
        }
        function parseLevels (level) {
            for (let i = items.length - 1; i >= 0; i--) {
                found = false;
                for (let j = 0;  j < orderedItems.length; j++) {
                    if (items[i] && items[i].additionalFields.parentId === orderedItems[j].referencedComponentId) {
                        orderedItems.splice(j + 1, 0, items[i]);
                        items.splice(i, 1);
                        found = true;
                    }
                }
                if (items[i] && ! found && items[i].additionalFields.depth === level) {
                    orderedItems.push(items[i]);
                    items.splice(i, 1);
                }
            }
            if (items.length !== 0) {
                level += 1;
                parseLevels(level);
            }
        }
        if (items.length !== 0 && items[0].additionalFields.depth) {
            parseLevels(2);
        }
        return orderedItems;
    }
}
