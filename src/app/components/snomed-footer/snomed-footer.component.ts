import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditService } from '../../services/edit.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-snomed-footer',
    templateUrl: './snomed-footer.component.html',
    styleUrls: ['./snomed-footer.component.scss']
})
export class SnomedFooterComponent implements OnDestroy {

    editable: boolean;
    unsavedChanges: boolean;
    editSubscription: Subscription;
    changesSubscription: Subscription;

    year: number = new Date().getFullYear();

    constructor(private editService: EditService, private modalService: ModalService) {
        this.editSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.changesSubscription = this.editService.getUnsavedChanges().subscribe(data => this.unsavedChanges = data);
    }

    saveChanges() {
        this.editService.saveChangeLog();
    }

    ngOnDestroy() {
        this.editSubscription.unsubscribe();
        this.changesSubscription.unsubscribe();
    }

}
