import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
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
    private changeLog = new BehaviorSubject<RefSet[]>([]);

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

    public setChangeLog(value) {
        this.changeLog.next(value);
    }

    getChangeLog(): Observable<RefSet[]> {
        return this.changeLog.asObservable();
    }

    public saveChangeLog() {
        if (this.localChanges) {
            this.saveIterable(this.localChanges[0]);
        }
    }

    saveIterable(item) {
        if (item.additionalFields.grouped) {
            switch (item.additionalFields.grouped) {
                case false:
                    item.additionalFields.grouped = '0';
                    break;
                case true:
                    item.additionalFields.grouped = '1';
                    break;
            }
        }

        if (!item.memberId) {
            this.terminologyService.postRefsetMember(item).subscribe(
                () => {
                    this.nextIterable();
                });
        } else if (item.deleted) {
            this.terminologyService.deleteRefsetMember(item).subscribe(
                () => {
                    this.nextIterable();
                });
        } else {
            this.terminologyService.putRefsetMember(item).subscribe(
                () => {
                    this.nextIterable();
                });
        }
    }

    nextIterable() {
        this.localChanges.shift();

        if (this.localChanges.length) {
            this.saveIterable(this.localChanges[0]);
        } else {
            this.mrcmmtService.setupDomains();
            this.setChangeLog([]);
        }
    }
}
