import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AttributeService {

    constructor() {
    }

    private attributes = new Subject<any>();

    setAttributes(attributes) {
        console.log('ATTRIBUTES: ', attributes);
        this.attributes.next(attributes);
    }

    collectAttributes(): Observable<any> {
        return this.attributes.asObservable();
    }
}
