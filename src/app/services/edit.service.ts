import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { RefSet } from '../models/refset';
import { TerminologyServerService } from './terminologyServer.service';
import { MrcmmtService } from './mrcmmt.service';
import { RangeService } from './range.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class EditService {
    localChanges: RefSet[];
    changeLogSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;

    constructor(private terminologyService: TerminologyServerService,
                private mrcmmtService: MrcmmtService,
                private rangeService: RangeService,
                private toastr: ToastrService) {
        this.changeLogSubscription = this.getChangeLog().subscribe(data => this.localChanges = data);
        this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
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
            this.saveIterable(this.localChanges);
            this.setChangeLog([]);
        }
    }

    saveIterable(changes) {
        const item = changes[0];

        if (item.additionalFields.hasOwnProperty('grouped')) {
            switch (item.additionalFields.grouped) {
                case false:
                    item.additionalFields.grouped = '0';
                    break;
                case true:
                    item.additionalFields.grouped = '1';
                    break;
            }
        }

        if (item.deleted) {
            delete item.newRefset;
            this.terminologyService.deleteRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(changes);
                },
                (error) => {
                    this.activeRange.etlError = error.error.message;
                    this.toastr.error(error.error.message, 'ERROR', {closeButton: true, disableTimeOut: true});
                });
        } else if (item.newRefset) {
            this.terminologyService.postRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(changes);
                },
                (error) => {
                    this.activeRange.etlError = error.error.message;
                    this.toastr.error(error.error.message, 'ERROR', {closeButton: true, disableTimeOut: true});
                });
        } else if (item.memberId && !item.newRefset) {
            this.terminologyService.putRefsetMember(item).subscribe(
                () => {
                    this.nextIterable(changes);
                },
                (error) => {
                    this.activeRange.etlError = error.error.message;
                    this.toastr.error(error.error.message, 'ERROR', {closeButton: true, disableTimeOut: true});
                });
        } else {
            console.error('Attempted to save Refset that was neither DELETED, POSTED, nor UPDATED');
        }
    }

    nextIterable(changes) {
        changes.shift();

        if (changes.length) {
            this.saveIterable(changes);
        } else {
            this.mrcmmtService.setupDomains();
        }
    }
}
