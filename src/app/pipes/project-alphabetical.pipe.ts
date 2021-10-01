import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'projectAlphabetical'
})
export class ProjectAlphabeticalPipe implements PipeTransform {

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        items = items.sort(function (item1, item2) {
            if (item1.branchPath > item2.branchPath) {
                return 1;
            }

            if (item1.branchPath < item2.branchPath) {
                return -1;
            }
        });

        return items;
    }
}
