import {Component, HostListener, OnInit} from '@angular/core';
import { AuthoringService } from './services/authoring.service';
import { Versions } from './models/versions';
import { Title } from '@angular/platform-browser';
import 'jquery';
import { UIConfiguration } from './models/uiConfiguration';
import { TerminologyServerService } from './services/terminologyServer.service';
import { DomainService } from './services/domain.service';
import { AttributeService } from './services/attribute.service';
import { RangeService } from './services/range.service';
import { BranchingService } from './services/branching.service';
import { MrcmmtService } from './services/mrcmmt.service';
import { AuthenticationService } from './services/authentication.service';
import { ModalService } from './services/modal.service';
import { EditService } from './services/edit.service';
import { UrlParamsService } from './services/url-params.service';
import {Subscription} from 'rxjs';
import {PathingService} from './services/pathing/pathing.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment: string;
    instance: string;
    versions: Versions;

    unsavedChanges: any[];
    unsavedChangesSubscription: Subscription;

    constructor(private domainService: DomainService,
                private attributeService: AttributeService,
                private rangeService: RangeService,
                private authoringService: AuthoringService,
                private terminologyService: TerminologyServerService,
                private titleService: Title,
                private branchingService: BranchingService,
                private mrcmmtService: MrcmmtService,
                private authenticationService: AuthenticationService,
                public modalService: ModalService,
                public editService: EditService,
                private urlParamsService: UrlParamsService,
                private pathingService: PathingService) {
        this.unsavedChangesSubscription = this.editService.getChangeLog().subscribe((response) => this.unsavedChanges = response);
    }

    @HostListener('window:beforeunload', ['$event'])
    onWindowClose(event: any): void {
        if (this.unsavedChanges.length) {
            event.preventDefault();
            event.returnValue = true;
        }
    }

    ngOnInit() {
        this.titleService.setTitle('SNOMED CT MRCM Maintenance Tool');
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.instance = window.location.host;

        this.authoringService.uiConfiguration = new UIConfiguration('', '/snowstorm/snomed-ct/', '', []);

        this.pathingService.httpGetBranches().subscribe(branches => {
            this.pathingService.setBranches(branches);

            const international = branches.find(branch => branch.shortName === 'SNOMEDCT');

            this.pathingService.setActiveBranch(international);
            this.domainService.internationalModuleIds = international.modules;

            if (this.instance.includes('browser')) {
                this.publicConfig();
            } else if (this.instance.includes('dailybuild')) {
                this.dailybuildConfig();
            } else {
                this.privateConfig();
            }
        });

        // this.pathingService.httpGetProjects().subscribe(projects => {
        //     this.pathingService.setProjects(projects);
        // });

        this.assignFavicon();
    }

    publicConfig() {
        this.authoringService.uiConfiguration = new UIConfiguration('', '/snowstorm/snomed-ct/', '', []);
        let showFuture = false;
        if (window.location.hostname.includes('concrete') || window.location.hostname.includes('preview')) {
            showFuture = true;
        }
        this.terminologyService.getVersions(showFuture).subscribe(versions => {
            this.branchingService.setLatestReleaseBranchPath(versions.reduce((a, b) => {
                return a.effectiveDate > b.effectiveDate ? a : b;
            }).branchPath);

            versions = versions.filter(item => {
                return item.effectiveDate >= 20170731;
            });

            versions.reverse();
            
            let versionFound = false;
            const branch = this.urlParamsService.getBranchParam();            
            if (branch) {
                const filteredVersions = versions.filter(item => {
                    return item.branchPath === branch;
                });
                if (filteredVersions.length === 1) {
                    this.branchingService.setBranchPath(filteredVersions[0].branchPath);
                    this.pathingService.setActiveBranch(filteredVersions[0]);
                    versionFound = true;
                }
            }
            if (!versionFound) {
                this.branchingService.setBranchPath(versions[0].branchPath);
                this.pathingService.setActiveBranch(versions[0]);
            }            

            this.editService.setEditor(false);
            this.branchingService.setVersions(versions);

            this.terminologyService.getAttributeHierarchy().subscribe(hierarchyAttributes => {
                this.attributeService.setAttributeHierarchy(hierarchyAttributes);
                this.setLatestReleaseDomains();
                this.setLatestReleaseAttributes();
                this.terminologyService.getAttributesWithConcreteDomains().subscribe(attributes => {
                    this.attributeService.setAttributesWithConcreteDomains(attributes.items);
                    this.mrcmmtService.setupDomains();
                });
            });
        });
    }

    dailybuildConfig() {
        this.authoringService.uiConfiguration = new UIConfiguration('', '/snowstorm/snomed-ct/', '', []);
        this.branchingService.setLatestReleaseBranchPath('MAIN');
        this.branchingService.setBranchPath('MAIN');
        this.editService.setEditor(false);
        this.branchingService.setVersions([{branchPath: 'MAIN'}]);

        this.terminologyService.getAttributeHierarchy().subscribe(hierarchyAttributes => {
            this.attributeService.setAttributeHierarchy(hierarchyAttributes);
            this.setLatestReleaseDomains();
            this.setLatestReleaseAttributes();
            this.terminologyService.getAttributesWithConcreteDomains().subscribe(attributes => {
                this.attributeService.setAttributesWithConcreteDomains(attributes.items);
                this.mrcmmtService.setupDomains();
            });
        });
    }

    privateConfig() {
        this.authoringService.getUIConfiguration().subscribe(data => {
            this.authoringService.uiConfiguration = data;
            // this.branchingService.setBranchPath('MAIN');

            this.terminologyService.getVersions(true).subscribe(versions => {
                this.branchingService.setLatestReleaseBranchPath(versions.reduce((a, b) => {
                    return a.effectiveDate > b.effectiveDate ? a : b;
                }).branchPath);

                this.authenticationService.getLoggedInUser().subscribe(user => {
                    this.authoringService.getProjects().subscribe(projects => {
                        projects.unshift({key: 'MAIN', branchPath: 'MAIN'});

                        // if (this.urlParamsService.getBranchParam()) {
                        //     this.branchingService.setBranchPath(this.urlParamsService.getBranchParam());
                        // } else {
                        //     this.branchingService.setBranchPath(projects[0]['branchPath']);
                        // }

                        if (user.roles.includes('ROLE_mrcm-author')) {
                            this.editService.setEditor(true);
                        } else {
                            this.editService.setEditor(false);
                        }

                        this.branchingService.setVersions(projects);
                    });

                    this.terminologyService.getAttributeHierarchy().subscribe(hierarchyAttributes => {
                        this.attributeService.setAttributeHierarchy(hierarchyAttributes);
                        this.setLatestReleaseDomains();
                        this.setLatestReleaseAttributes();
                        this.terminologyService.getAttributesWithConcreteDomains().subscribe(attributes => {
                            this.attributeService.setAttributesWithConcreteDomains(attributes.items);
                            this.mrcmmtService.setupDomains();
                        });
                    });
                });
            });
        });
    }

    setLatestReleaseDomains() {
        this.terminologyService.getDomains(this.branchingService.getLatestReleaseBranchPath()).subscribe(data => {
            this.domainService.setLatestReleaseDomains(data);
        });
    }

    setLatestReleaseAttributes() {
        this.terminologyService.getAttributes(this.branchingService.getLatestReleaseBranchPath()).subscribe(data => {
            this.attributeService.setLatestReleaseAttributes(data);
        });
    }

    assignFavicon() {
        const favicon = $('#favicon');

        switch (this.environment) {
            case 'local':
                favicon.attr('href', 'favicon_grey.ico');
                break;
            case 'dev':
                favicon.attr('href', 'favicon_red.ico');
                break;
            case 'uat':
                favicon.attr('href', 'favicon_green.ico');
                break;
            case 'training':
                favicon.attr('href', 'favicon_yellow.ico');
                break;
            default:
                favicon.attr('href', 'favicon.ico');
                break;
        }
    }
}
