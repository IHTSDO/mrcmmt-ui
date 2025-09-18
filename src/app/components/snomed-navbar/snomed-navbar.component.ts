import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BranchingService } from '../../services/branching.service';
import { MrcmmtService } from '../../services/mrcmmt.service';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { EditService } from '../../services/edit.service';
import { DomainService } from '../../services/domain.service';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { AttributeService } from '../../services/attribute.service';
import { RangeService } from '../../services/range.service';
import { PathingService} from '../../services/pathing/pathing.service';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { AlphabeticalPipe } from '../../pipes/alphabetical/alphabetical.pipe';
import { BranchPipe } from '../../pipes/branch/branch.pipe';
import { ProjectPipe } from '../../pipes/project/project.pipe';
import { EffectiveTimeDescendantPipe } from '../../pipes/effective-time-descendant.pipe';
import {DrawerService} from '../../services/drawer.service';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss'],
    imports: [RouterLink, NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, AlphabeticalPipe, BranchPipe, ProjectPipe, EffectiveTimeDescendantPipe]
})
export class SnomedNavbarComponent implements OnInit {

    instance: string;
    environment: string;
    public: boolean;
    branchPath: string;
    branchPathSubscription: Subscription;
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
                private drawerService: DrawerService,
                private terminologyService: TerminologyServerService,
                private rangeService: RangeService,
                private pathingService: PathingService) {
        this.userSubscription = this.authenticationService.getUser().subscribe(data => this.user = data);
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.public = window.location.host.includes('browser');
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => {
            this.branchPath = data;
            this.mrcmmtService.setupDomains();
        });
        this.branchesSubscription = this.pathingService.getBranches().subscribe(data => this.branches = data);
        this.activeBranchSubscription = this.pathingService.getActiveBranch().subscribe(data => this.activeBranch = data);
        this.projectsSubscription = this.pathingService.getProjects().subscribe(data => this.projects = data);
        this.activeProjectSubscription = this.pathingService.getActiveProject().subscribe(data => this.activeProject = data);
        this.versionsSubscription = this.branchingService.getVersions().subscribe(data => this.versions = data);
        this.editableSubscription = this.editService.getEditable().subscribe(data => this.editable = data);
    }

    ngOnInit() {
        this.instance = window.location.host;

        if (!this.instance.includes('browser') && !this.instance.includes('dailybuild')) {
            this.pathingService.httpGetBranches().subscribe(branches => {
                this.pathingService.setBranches(branches);
                this.pathingService.setActiveBranch(branches.find(branch => branch.shortName === 'SNOMEDCT'));
            });

            this.pathingService.httpGetProjects().subscribe(projects => {
                this.pathingService.setProjects(projects);
            });
        }
    }

    logout() {
        this.authenticationService.logout();
    }

    setPath(path) {
        this.branchingService.setBranchPath(path);
        let self = this;
        setTimeout(function(){
            self.pathingService.setActiveBranch({branchPath: path});
            self.domainService.clearActiveDomain();
            self.attributeService.clearActiveAttribute();
            self.rangeService.clearActiveRange();
            self.terminologyService.getAttributesWithConcreteDomains().subscribe(ConcreteAttributes => {
                self.terminologyService.getAttributeHierarchy().subscribe(attributes => {
                    self.attributeService.setAttributeHierarchy(attributes);
                    self.attributeService.setAttributesWithConcreteDomains(ConcreteAttributes.items);
                    self.mrcmmtService.setupDomains();
                });
            });
        }, 0);
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
        this.domainService.setDomains(null);
        this.attributeService.setAttributes(null);
        this.rangeService.setRanges(null);
        this.terminologyService.getAttributesWithConcreteDomains().subscribe(ConcreteAttributes => {
            this.terminologyService.getAttributeHierarchy().subscribe(attributes => {
                this.attributeService.setAttributeHierarchy(attributes);
                this.attributeService.setAttributesWithConcreteDomains(ConcreteAttributes.items);
                this.mrcmmtService.setupDomains();
            });
        });
    }

    noProject() {
        this.pathingService.setActiveProject(null);
    }

    openDrawer() {
        this.drawerService.setDrawerOpen(true);
        document.body.classList.add('app-drawer-open');
    }
}
