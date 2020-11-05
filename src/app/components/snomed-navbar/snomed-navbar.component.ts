import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnomedResponseObject } from '../../models/snomedResponseObject';
import { BranchingService } from '../../services/branching.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { EditService } from '../../services/edit.service';
import { DomainService } from '../../services/domain.service';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {

    environment: string;
    public: boolean;
    branchPath: string;
    branchPathSubscription: Subscription;
    versions: SnomedResponseObject;
    versionsSubscription: Subscription;
    user: User;
    userSubscription: Subscription;
    editable: boolean;
    editableSubscription: Subscription;

    constructor(private branchingService: BranchingService,
                private mrcmmtService: MrcmmtService,
                private authenticationService: AuthenticationService,
                private editService: EditService,
                private domainService: DomainService,
                private attributeService: AttributeService,
                private terminologyService: TerminologyServerService,
                private rangeService: RangeService) {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.public = window.location.host.includes('browser');
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
            this.branchPath = data;
            this.mrcmmtService.setupDomains();
        });
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.userSubscription = this.getUser();
        this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
    }

    ngOnInit() {
    }

    getUser() {
        if (!this.public) {
            return this.authenticationService.getLoggedInUser().subscribe(data => this.user = data);
        } else {
            return null;
        }
    }

    logout() {
        this.authenticationService.logout();
    }

    setPath(path) {
        this.branchingService.setBranchPath(path);
        this.domainService.clearActiveDomain();
        this.attributeService.clearActiveAttribute();
        this.rangeService.clearActiveRange();
        this.terminologyService.getAttributesWithConcreteDomains().subscribe(attributes => {
                this.attributeService.setAttributesWithConcreteDomains(attributes.items);
                this.mrcmmtService.setupDomains();
            });
    }
}
