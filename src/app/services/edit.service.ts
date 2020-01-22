import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChangeLog } from '../models/changeLog';

@Injectable({
    providedIn: 'root'
})
export class EditService {

    constructor() {
    }

    private editable = new Subject<Boolean>();
    private unsavedChanges = new Subject<Boolean>();
    private changeLog = new Subject<[ChangeLog]>();

    // Setters & Getters: Edit

    public setEditable(value) {
        this.editable.next(value);
    }

    getEditable(): Observable<Boolean> {
        return this.editable.asObservable();
    }

    public setUnsavedChanges(value) {
        this.unsavedChanges.next(value);
    }

    getUnsavedChanges(): Observable<Boolean> {
        return this.unsavedChanges.asObservable();
    }

    public setChangeLog(value) {
        this.changeLog.next(value);
    }

    getChangeLog(): Observable<[ChangeLog]> {
        return this.changeLog.asObservable();
    }
}