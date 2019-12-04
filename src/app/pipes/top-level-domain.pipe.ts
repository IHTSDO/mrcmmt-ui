import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topLevelDomain'
})
export class TopLevelDomainPipe implements PipeTransform {

  transform(items: any[]): any[] {

    const itemsBySemtag = {};
    const orderedItems = [];
    for (let i = 0; i < items.length; i++) {
        const semtag = items[i].referencedComponent.fsn.term.replace( /(^.*\(|\).*$)/g, '');
        if (!items[i].additionalFields.parentDomain) {
            if (!itemsBySemtag[semtag]) {
                itemsBySemtag[semtag] = [];
            }
            itemsBySemtag[semtag].push(items[i]);
        }
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].additionalFields.parentDomain) {
            const parent = items[i].additionalFields.parentDomain.replace(/\D/g, '');
            Object.values(itemsBySemtag).forEach((item) => {
                if (parent === item[0].referencedComponentId) {
                    itemsBySemtag[item[0].referencedComponent.fsn.term.replace( /(^.*\(|\).*$)/g, '')].push(items[i]);
                }
            });
        }
    }

    Object.values(itemsBySemtag).forEach((item: any[] ) => {
        item.forEach((object) => {
            orderedItems.push(object);
        });
    });

    return orderedItems;
  }
}
