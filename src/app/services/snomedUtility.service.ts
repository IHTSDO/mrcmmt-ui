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
}
