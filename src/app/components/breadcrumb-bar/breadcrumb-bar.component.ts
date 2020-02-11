import { Component, OnDestroy } from '@angular/core';
import { RefSet } from '../../models/refset';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { Subscription } from 'rxjs';
import { EditService } from '../../services/edit.service';
import { BranchingService } from '../../services/branching.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-breadcrumb-bar',
    templateUrl: './breadcrumb-bar.component.html',
    styleUrls: ['./breadcrumb-bar.component.scss']
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
    changes: boolean;
    changesSubscription: Subscription;
    branchPath: string;
    branchPathSubscription: Subscription;

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private editService: EditService,
                private branchingService: BranchingService,
                private mrcmmtService: MrcmmtService,
                private modalService: ModalService) {
            this.activeDomainSubscription = this.domainService.getActiveDomain().subscribe(data => this.activeDomain = data);
            this.activeAttributeSubscription = this.attributeService.getActiveAttribute().subscribe(data => this.activeAttribute = data);
            this.activeRangeSubscription = this.rangeService.getActiveRange().subscribe(data => this.activeRange = data);
            this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
            this.editorSubscription = this.editService.getEditor().subscribe(data => this.editor = data);
            this.changesSubscription = this.editService.getUnsavedChanges().subscribe(data => this.changes = data);
            this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
                this.branchPath = data;
            });
    }

    reset() {
        if (this.changes) {
            this.modalService.open('discard-modal');
        } else {
            this.mrcmmtService.resetTool();
            this.editService.setChangeLog([]);
            this.editService.setUnsavedChanges(false);
        }
    }

    toggleEditable() {
        if (!this.changes) {
            if (this.editable) {
                this.branchingService.setBranchPath('MAIN');
            } else {
                this.branchingService.setBranchPath('MAIN/MRCMMAINT1');
            }
            this.editService.setEditable(!this.editable);
        }
    }

    ngOnDestroy() {
        this.activeDomainSubscription.unsubscribe();
        this.activeAttributeSubscription.unsubscribe();
        this.activeRangeSubscription.unsubscribe();
        this.editableSubscription.unsubscribe();
    }
}
