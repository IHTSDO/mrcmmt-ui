import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnomedResponseObject } from '../../models/snomedResponseObject';
import { BranchingService } from '../../services/branching.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { EditService } from '../../services/edit.service';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {

    private environment: string;
    private branchPath: string;
    private branchPathSubscription: Subscription;
    private versions: SnomedResponseObject;
    private versionsSubscription: Subscription;
    private user: User;
    private userSubscription: Subscription;
    private editable: boolean;
    private editableSubscription: Subscription;

    constructor(private branchingService: BranchingService,
                private mrcmmtService: MrcmmtService,
                private authenticationService: AuthenticationService,
                private editService: EditService) {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
            this.branchPath = data;
            this.mrcmmtService.setupDomains();
        });
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.userSubscription = this.authenticationService.getLoggedInUser().subscribe(data => this.user = data);
        this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
    }

    ngOnInit() {
    }

    logout() {
        this.authenticationService.logout();
    }

    setPath(path) {
        this.branchingService.setBranchPath(path);
    }
}
