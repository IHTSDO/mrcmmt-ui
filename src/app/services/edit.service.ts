import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { RefSet } from '../models/refset';
import { TerminologyServerService } from './terminologyServer.service';
import { MrcmmtService } from './mrcmmt.service';

@Injectable({
    providedIn: 'root'
})
export class EditService {
    localChanges: RefSet[];
    changeLogSubscription: Subscription;

    constructor(private terminologyService: TerminologyServerService, private mrcmmtService: MrcmmtService) {
        this.changeLogSubscription = this.getChangeLog().subscribe(data => this.localChanges = data);
    }

    private editable = new Subject<boolean>();
    private editor = new Subject<boolean>();
    private unsavedChanges = new Subject<boolean>();
    private changeLog = new Subject<RefSet[]>();

    // Setters & Getters: Edit

    public setEditable(value) {
        this.editable.next(value);
    }

    getEditable(): Observable<boolean> {
        return this.editable.asObservable();
    }

    public setEditor(value) {
        this.editor.next(value);
    }

    getEditor(): Observable<boolean> {
        return this.editor.asObservable();
    }

    public setUnsavedChanges(value) {
        this.unsavedChanges.next(value);
    }

    getUnsavedChanges(): Observable<boolean> {
        return this.unsavedChanges.asObservable();
    }

    public setChangeLog(value) {
        this.changeLog.next(value);
    }

    getChangeLog(): Observable<RefSet[]> {
        return this.changeLog.asObservable();
    }

    public saveChangeLog() {
        if (this.localChanges) {
            this.saveIterable(this.localChanges[0], 0);
        }
    }

    saveIterable(item, index) {
        if (!item.memberId) {
            this.terminologyService.postRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(index);
                });
        } else if (item.deleted) {
            this.terminologyService.deleteRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(index);
                });
        } else {
            this.terminologyService.putRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(index);
                });
        }
    }

    nextIterable(index) {
        if (this.localChanges[index + 1]) {
            this.saveIterable(this.localChanges[index + 1], index + 1);
        } else {
            this.mrcmmtService.setupDomains();
            this.setUnsavedChanges(false);
            this.setChangeLog([]);
        }
    }
}
