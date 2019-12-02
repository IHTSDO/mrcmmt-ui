import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textMatch'
})
export class TextMatchPipe implements PipeTransform {

    transform(items: any[], text: string): any[] {
        if (!items) {
            return [];
        }
        if (!text) {
            return items;
        }

        text = text.toLowerCase();

        if (!isNaN(Number(text))) {
            items = items.filter(item => item.referencedComponentId === text);
        } else {
            items = items.filter(item => {
                return item.referencedComponent.fsn.term.toLowerCase().includes(text);
            });
        }
        return items;
    }
}
