import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditService } from '../../services/edit.service';
import { ModalService } from '../../services/modal.service';
import { RefSet } from '../../models/refset';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-snomed-footer',
    templateUrl: './snomed-footer.component.html',
    styleUrls: ['./snomed-footer.component.scss'],
    imports: [CommonModule]
})
export class SnomedFooterComponent implements OnDestroy {

    editable: boolean;
    editableSubscription: Subscription;
    changeLog: RefSet[];
    changeLogSubscription: Subscription;

    year: number = new Date().getFullYear();

    constructor(private editService: EditService,
                public modalService: ModalService) {
        this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
        this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
    }

    ngOnDestroy() {
        this.editableSubscription.unsubscribe();
        this.changeLogSubscription.unsubscribe();
    }

}
