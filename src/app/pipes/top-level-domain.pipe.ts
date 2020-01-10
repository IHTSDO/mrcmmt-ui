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
            Object.values(itemsBySemtag).forEach((semtagItems: any[]) => {
                for (let j = 0; j < semtagItems.length; j++) {
                    if (parent === semtagItems[j].referencedComponentId) {
                        if (parent !== semtagItems[0].referencedComponentId) {
                            items[i].tertiary = true;
                        }
                        itemsBySemtag[SnomedUtilityService.getSemanticTagFromFsn(semtagItems[j].referencedComponent.fsn.term)]
                            .splice(j + 1, 0, items[i]);
                    }
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
