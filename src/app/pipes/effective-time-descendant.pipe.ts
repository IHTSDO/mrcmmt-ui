import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'effectiveTimeDescendant'
})
export class EffectiveTimeDescendantPipe implements PipeTransform {

  transform(items: any[]): any {
    if (!items) {
      return [];
    }

    items = items.sort(function (item1, item2) {
        return item2.effectiveTime - item1.effectiveTime;
    });

    return items;
  }

}
