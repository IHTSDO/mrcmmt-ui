import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'managedService'
})
export class ManagedServicePipe implements PipeTransform {

    transform(items: any[]): any[] {
        if (!items) {
            return [];
        }

        items = items.filter(item => {
            if (!item.codeSystem || !item.codeSystem.maintainerType || item.codeSystem.maintainerType !== 'Managed Service') {
                return item;
            }
        });

        return items;
    }

}
