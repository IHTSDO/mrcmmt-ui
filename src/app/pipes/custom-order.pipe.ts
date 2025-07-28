import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customOrder'})
export class CustomOrderPipe implements PipeTransform {

    transform(items: any[], orderIds: string[]): any {
        if (!items) {
            return [];
        }
        if (!orderIds) {
            return items;
        }

        const response = [];

        orderIds.forEach(string => {
            items.forEach(item => {
                if (string === item.additionalFields.contentTypeId) {
                    response.push(item);
                }
            });
        });

        return response;
    }
}
