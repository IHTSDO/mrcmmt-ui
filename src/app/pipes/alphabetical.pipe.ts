import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alphabetical'
})
export class AlphabeticalPipe implements PipeTransform {
    static semanticTagCollector(str) {
        const openParenthesisIndex = str.indexOf('(');
        const closedParenthesisIndex = str.indexOf(')', openParenthesisIndex);
        return str.substring(openParenthesisIndex, closedParenthesisIndex + 1);
    }

    transform(items: any[]): any {
        if (!items) {
            return [];
        }

        items = items.sort(function (item1, item2) {
            if (AlphabeticalPipe.semanticTagCollector(item1.referencedComponent.fsn.term)
                > AlphabeticalPipe.semanticTagCollector(item2.referencedComponent.fsn.term)) {
                return 1;
            }

            if (AlphabeticalPipe.semanticTagCollector(item1.referencedComponent.fsn.term)
                < AlphabeticalPipe.semanticTagCollector(item2.referencedComponent.fsn.term)) {
                return -1;
            }

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
