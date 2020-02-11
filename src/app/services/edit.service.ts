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
        this.localChanges.forEach((item) => {
            if (!item.memberId) {
                this.terminologyService.postRefsetMember(item).subscribe(response => {
                    this.mrcmmtService.setupDomains();
                });
            } else if (item.deleted) {
                this.terminologyService.deleteRefsetMember(item).subscribe(response => {
                    this.mrcmmtService.setupDomains();
                });
            } else {
                this.terminologyService.putRefsetMember(item).subscribe(response => {
                    this.mrcmmtService.setupDomains();
                });
            }
        });
        this.setUnsavedChanges(false);
        this.setChangeLog([]);
    }
}
