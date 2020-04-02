import { Injectable } from '@angular/core';
import { Concept } from '../models/concept';

@Injectable({
    providedIn: 'root'
})
export class SnomedUtilityService {

    constructor() {
    }

    static convertShortConceptToString(input): string {
        return input.id + ' |' + input.fsn.term + '|';
    }

    static convertFullConceptToShortConcept(input): Concept {
        return { sctId: input.id, fsn: input.fsn.term, new: true};
    }

    static convertStringToShortConcept(input: string): Concept {
        input = input.trim();

        const sctId = String(input.match(/\d+/)[0]);
        let fsn: string;

        input.includes('|') ? fsn = input.slice(input.indexOf('|') + 1, input.lastIndexOf('|')) : fsn = '';

        return {sctId: sctId, fsn: fsn, new: null};
    }

    static convertStringListToShortConceptList(input: string): Concept[] {
        input = input.trim();
        const stringArray = input.replace(/,\s*$/, '').split(',');

        const output: Concept[] = [];

        stringArray.forEach(text => {
            output.push(this.convertStringToShortConcept(text));
        });

        return output;
    }

    static getSemanticTagFromFsn(input): string {
        return input.replace( /(^.*\(|\).*$)/g, '');
    }

    static getIdFromShortConcept(input): string {
        return input.replace(/\D/g, '');
    }

    // Takes a string ETL expression and returns an array of ETL expression lines, correctly indented.
    static ETLexpressionBuilder(expression: string) {
        const response = expression.match(/(?:[^:,](?!OR))+(?:[:,\s]| OR)*/g);

        let whitespaceCount = 0;

        for (let i = 0; i < response.length; i++) {
            if (i !== 0) {
                if (response[i - 1].includes(':')) {
                    whitespaceCount++;
                }

                if (response[i - 1].includes('{') && !response[i - 1].includes('}')) {
                    whitespaceCount++;
                }

                if (!response[i - 1].includes('{') && response[i - 1].includes('}')) {
                    whitespaceCount--;
                }

                if (!response[i - 1].includes('OR') && response[i].startsWith('OR')) {
                    whitespaceCount++;
                }

                if (response[i - 1].includes('OR') && response[i - 1].trim().endsWith(',')) {
                    whitespaceCount--;
                }
            }

            response[i] =  '    '.repeat(whitespaceCount) + response[i].trim();
        }

        return response;
    }

    // Takes a string ECL expression and returns an array of ETL expression lines, correctly indented.
    static ECLexpressionBuilder(expression: string) {
        const response = expression.match(/(?:[^:,](?!OR)(?!\(<<))+(?:[:,\s]| OR)*/g);

        let whitespaceCount = 0;

        for (let i = 0; i < response.length; i++) {
            if (i !== 0) {
                if (response[i - 1].includes(':')) {
                    whitespaceCount++;
                }

                if (response[i].startsWith('<<') && !response[i - 1].includes(':')) {
                    whitespaceCount++;
                }

                if (!response[i - 1].includes('OR') && response[i].startsWith('OR')) {
                    whitespaceCount++;
                }

                if (response[i - 1].includes('OR') && response[i - 1].trim().endsWith(',')) {
                    whitespaceCount--;
                }

                if (response[i].startsWith('R')) {
                    whitespaceCount++;
                }
            }

            response[i] =  '    '.repeat(whitespaceCount) + response[i].trim();
        }

        return response;
    }
}
