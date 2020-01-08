import { Pipe, PipeTransform } from '@angular/core';
import { SnomedUtilityService } from '../services/snomedUtility.service';

@Pipe({
  name: 'topLevelDomain'
})
export class TopLevelDomainPipe implements PipeTransform {

  transform(items: any[]): any[] {

    const itemsBySemtag = {};
    const orderedItems = [];
    for (let i = 0; i < items.length; i++) {
        const semtag = SnomedUtilityService.getSemanticTagFromFsn(items[i].referencedComponent.fsn.term);
        if (!items[i].additionalFields.parentDomain) {
            if (!itemsBySemtag[semtag]) {
                itemsBySemtag[semtag] = [];
            }
            itemsBySemtag[semtag].push(items[i]);
        }
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].additionalFields.parentDomain) {
            const parent = SnomedUtilityService.getIdFromShortConcept(items[i].additionalFields.parentDomain);
            Object.values(itemsBySemtag).forEach((item: any[]) => {
                item.forEach((object) => {
                    if (parent === object.referencedComponentId) {
                        if (parent !== item[0].referencedComponentId) {
                            items[i].tertiary = true;
                        }
                        itemsBySemtag[SnomedUtilityService.getSemanticTagFromFsn(object.referencedComponent.fsn.term)].push(items[i]);
                    }
                });
            });
        }
    }
    console.log(itemsBySemtag);

    Object.values(itemsBySemtag).forEach((item: any[] ) => {
        item.forEach((object) => {
            orderedItems.push(object);
        });
    });

    return orderedItems;
  }
}
