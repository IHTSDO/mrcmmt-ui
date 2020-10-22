import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment: string;
    public: boolean;
    versions: Versions;

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
                private urlParamsService: UrlParamsService) {
    }

    ngOnInit() {
        this.titleService.setTitle('SNOMED CT MRCM Maintenance Tool');
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
        this.public = window.location.host.includes('browser');

        this.authoringService.uiConfiguration = new UIConfiguration('', '/snowstorm/snomed-ct/', '');

        if (this.public) {
            this.publicConfig();
        } else {
            this.privateConfig();
        }

        this.assignFavicon();
    }

    publicConfig() {
        this.authoringService.uiConfiguration = new UIConfiguration('', '/snowstorm/snomed-ct/', '');

        this.terminologyService.getVersions(false).subscribe(versions => {
            this.branchingService.setLatestReleaseBranchPath(versions.items.reduce((a, b) => {
                return a.effectiveDate > b.effectiveDate ? a : b;
            }).branchPath);

            this.setLatestReleaseDomains();
            this.setLatestReleaseAttributes();

            versions.items = versions.items.filter(item => {
                return item.effectiveDate >= 20170731;
            });

            versions.items.reverse();
            this.branchingService.setBranchPath(versions.items[0].branchPath);
            this.editService.setEditor(false);
            this.branchingService.setVersions(versions);
            this.mrcmmtService.setupDomains();
        });
    }

    privateConfig() {
        this.authoringService.getVersion().subscribe(
            data => {
                this.versions = data;
                console.log('Snowstorm Version:', data.versions['snowstorm']);
            }
        );

        this.authoringService.getUIConfiguration().subscribe(data => {
            this.authoringService.uiConfiguration = data;

            this.terminologyService.getVersions(true).subscribe(versions => {
                this.branchingService.setLatestReleaseBranchPath(versions.items.reduce((a, b) => {
                    return a.effectiveDate > b.effectiveDate ? a : b;
                }).branchPath);

                this.setLatestReleaseDomains();
                this.setLatestReleaseAttributes();

                versions.items = versions.items.filter(item => {
                    return item.effectiveDate >= 20170731;
                });

                this.authenticationService.getLoggedInUser().subscribe(user => {

                    if (user.roles.includes('ROLE_int-sca-author')) {
                        versions.items.push({branchPath: 'MAIN/MRCMMAINT1'});
                    }

                    versions.items.push({branchPath: 'MAIN'});

                    versions.items.reverse();

                    if (this.urlParamsService.getBranchParam()) {
                        this.branchingService.setBranchPath(this.urlParamsService.getBranchParam());
                    } else {
                        if (user.roles.includes('ROLE_int-sca-author')) {
                            this.branchingService.setBranchPath(versions.items[0].branchPath);
                        } else {
                            this.branchingService.setBranchPath(versions.items[1].branchPath);
                        }
                    }

                    if (user.roles.includes('ROLE_mrcm-author')) {
                        this.editService.setEditor(true);
                    } else {
                        this.editService.setEditor(false);
                    }

                    this.branchingService.setVersions(versions);
                    this.mrcmmtService.setupDomains();

                    this.terminologyService.getAttributeHierarchy().subscribe(attributes => {
                        this.attributeService.setAttributeHierarchy(attributes.items);
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
