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
import {PathingService} from '../../services/pathing/pathing.service';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {

    environment: string;
    public: boolean;
    // branchPath: string;
    // branchPathSubscription: Subscription;
    versions: any;
    versionsSubscription: Subscription;
    user: User;
    userSubscription: Subscription;
    editable: boolean;
    editableSubscription: Subscription;

    branches: any;
    branchesSubscription: Subscription;
    activeBranch: any;
    activeBranchSubscription: Subscription;

    projects: any;
    projectsSubscription: Subscription;
    activeProject: any;
    activeProjectSubscription: Subscription;

    constructor(private branchingService: BranchingService,
                private mrcmmtService: MrcmmtService,
                private authenticationService: AuthenticationService,
                private editService: EditService,
                private domainService: DomainService,
                private attributeService: AttributeService,
                private terminologyService: TerminologyServerService,
                private rangeService: RangeService,
                private pathingService: PathingService) {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.public = window.location.host.includes('browser');
        // this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
        //     this.branchPath = data;
        //     this.mrcmmtService.setupDomains();
        // });
        this.branchesSubscription = this.pathingService.getBranches().subscribe(data => this.branches = data);
        this.activeBranchSubscription = this.pathingService.getActiveBranch().subscribe(data => this.activeBranch = data);
        this.projectsSubscription = this.pathingService.getProjects().subscribe(data => this.projects = data);
        this.activeProjectSubscription = this.pathingService.getActiveProject().subscribe(data => this.activeProject = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.userSubscription = this.getUser();
        this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
    }

    ngOnInit() {
        this.pathingService.httpGetBranches().subscribe(branches => {
            this.pathingService.setBranches(branches);
            this.pathingService.setActiveBranch(branches.find(branch => branch.shortName === 'SNOMEDCT'));
        });

        this.pathingService.httpGetProjects().subscribe(projects => {
            this.pathingService.setProjects(projects);
        });
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

    clearActiveItems() {
        this.domainService.clearActiveDomain();
        this.attributeService.clearActiveAttribute();
        this.rangeService.clearActiveRange();
    }

    getAttributesWithConcreteDomains() {
        this.terminologyService.getAttributesWithConcreteDomains().subscribe(ConcreteAttributes => {
            this.terminologyService.getAttributeHierarchy().subscribe(attributes => {
                this.attributeService.setAttributeHierarchy(attributes);
                this.attributeService.setAttributesWithConcreteDomains(ConcreteAttributes.items);
                this.mrcmmtService.setupDomains();
            });
        });
    }

    setBranch(branch) {
        this.pathingService.setActiveBranch(branch);
        this.pathingService.setActiveProject(null);
        this.domainService.setDomains(null);
        this.attributeService.setAttributes(null);
        this.rangeService.setRanges(null);
        this.domainService.httpGetExtensionModuleId(branch.shortName).subscribe((data: any) => {
            this.domainService.setExtensionModuleId(data.metadata.defaultModuleId);
        });
        this.clearActiveItems();
        this.getAttributesWithConcreteDomains();
    }

    setProject(project) {
        const proj = this.projects.find(item => item.key === project.key);
        this.pathingService.setActiveProject(proj);
    }

    noProject() {
        this.pathingService.setActiveProject(null);
    }
}
