import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnomedResponseObject } from '../../models/snomedResponseObject';
import { BranchingService } from '../../services/branching.service';
import { MrcmmtService } from '../../services/mrcmmt.service';

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

    constructor(private branchingService: BranchingService, private mrcmmtService: MrcmmtService) {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => this.branchPath = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
    }

    ngOnInit() {
    }

    setPath(path) {
        this.branchingService.setBranchPath(path);
        this.mrcmmtService.setupDomains();
    }
}
