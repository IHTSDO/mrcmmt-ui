import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EditService {

    constructor() {
    }

    private editable = new Subject<Boolean>();

    // Setters & Getters: Attributes
    
    public setEditable(value) {
        this.editable.next(value);
    }
    
    getEditable(): Observable<Boolean> {
        return this.editable.asObservable();
    }
}
