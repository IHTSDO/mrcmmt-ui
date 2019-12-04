import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alphabetical'
})
export class AlphabeticalPipe implements PipeTransform {

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        items = items.sort(function (item1, item2) {
            if (item1.referencedComponent.fsn.term > item2.referencedComponent.fsn.term) {
                return 1;
            }

            if (item1.referencedComponent.fsn.term < item2.referencedComponent.fsn.term) {
                return -1;
            }
        });

        return items;
    }
}
