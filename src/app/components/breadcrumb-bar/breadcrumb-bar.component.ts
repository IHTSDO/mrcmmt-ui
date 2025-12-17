import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { Subscription } from 'rxjs';
import { EditService } from '../../services/edit.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-breadcrumb-bar',
    templateUrl: './breadcrumb-bar.component.html',
    styleUrls: ['./breadcrumb-bar.component.scss'],
    imports: [CommonModule, ModalComponent]
})
export class BreadcrumbBarComponent implements OnDestroy {

    activeDomain: RefSet;
    activeDomainSubscription: Subscription;
    activeAttribute: RefSet;
    activeAttributeSubscription: Subscription;
    activeRange: RefSet;
    activeRangeSubscription: Subscription;
    editable: boolean;
    editor: boolean;
    editorSubscription: Subscription;
    editableSubscription: Subscription;
    changeLog: RefSet[];
    changeLogSubscription: Subscription;
    // branchPath: string;
    // branchPathSubscription: Subscription;

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private editService: EditService,
                // private branchingService: BranchingService,
                public mrcmmtService: MrcmmtService,
                public modalService: ModalService) {
            this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
            this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => this.activeAttribute = data);
            this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
            this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
            this.editorSubscription = this.editService.getEditor().subscribe(data => this.editor = data);
            this.changeLogSubscription = this.editService.getChangeLog().subscribe(data => this.changeLog = data);
            // this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
            //     this.branchPath = data;
            // });
    }

    openResetModal() {
        this.modalService.open('reset-modal');
    }

    openSwitchModal() {
        if (this.changeLog.length) {
            this.modalService.open('switch-modal');
        } else {
            // Skip opening modal as no edits found
            this.disableEditing();
        }
    }

    enableEditing() {
        this.editService.setEditable(true);
    }

    disableEditing() {
        this.editService.setEditable(false);
        this.mrcmmtService.resetTool();
    }

    resetTool() {
        this.mrcmmtService.resetTool();
    }

    ngOnDestroy() {
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.editableSubscription.unsubscribe();
    }
}
