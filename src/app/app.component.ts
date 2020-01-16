import { Component, OnInit } from '@angular/core';
import { AuthoringService } from './services/authoring.service';
import { Versions } from './models/versions';
import { Title } from '@angular/platform-browser';
import 'jquery';
import { TerminologyServerService } from './services/terminologyServer.service';
import { RefSet } from './models/refset';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment: string;
    versions: Versions;

    domains: RefSet[];
    activeDomain: RefSet;

    attributes: RefSet[];
    activeAttribute: RefSet;
    attributeMatchedDomains: RefSet[];

    ranges: RefSet[];
    activeRange: RefSet;

    domainFilter: string;
    attributeFilter: string;

    constructor(private authoringService: AuthoringService,
                private terminologyService: TerminologyServerService, private titleService: Title) {
    }

    ngOnInit() {
        this.titleService.setTitle('SNOMED CT MRCM Maintenance Tool');
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

        this.authoringService.getVersion().subscribe(
            data => {
                this.versions = data;

                console.log('Snowstorm Version:', data.versions['snowstorm']);
            }
        );

        this.authoringService.getUIConfiguration().subscribe(data => {
            this.authoringService.uiConfiguration = data;

            this.terminologyService.getDomains().subscribe(domains => {
                console.log('DOMAINS: ', domains);
                this.domains = domains.items;
            });

            this.terminologyService.getAttributes().subscribe(attributes => {
                console.log('ATTRIBUTES: ', attributes);
                this.attributes = attributes.items;
            });
        });

        this.assignFavicon();
    }

    resetTool() {
        this.activeDomain = null;
        this.activeAttribute = null;
        this.attributeMatchedDomains = null;
        this.activeRange = null;
        this.ranges = [];
        this.domainFilter = null;
        this.attributeFilter = null;
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
