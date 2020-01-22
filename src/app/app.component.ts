import { Component, OnInit } from '@angular/core';
import { AuthoringService } from './services/authoring.service';
import { Versions } from './models/versions';
import { Title } from '@angular/platform-browser';
import 'jquery';
import { TerminologyServerService } from './services/terminologyServer.service';
import { DomainService } from './services/domain.service';
import { AttributeService } from './services/attribute.service';
import { ActivatedRoute } from '@angular/router';
import { RefSet } from './models/refset';
import { RangeService } from './services/range.service';
import { CustomOrderPipe } from './pipes/custom-order.pipe';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ CustomOrderPipe ]
})
export class AppComponent implements OnInit {

    environment: string;
    versions: Versions;

    activeDomain: RefSet;
    activeAttribute: RefSet;
    activeRange: RefSet;

    constructor(private domainService: DomainService, private attributeService: AttributeService, private rangeService: RangeService,
                private authoringService: AuthoringService, private terminologyService: TerminologyServerService,
                private titleService: Title, private route: ActivatedRoute, private customOrder: CustomOrderPipe) {
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
            this.setupDomains();
        });
        this.assignFavicon();
    }

    setupDomains() {
        this.terminologyService.getDomains().subscribe(domains => {
            this.domainService.setDomains(domains);

            if (this.route.snapshot.queryParamMap.get('domain')) {
                this.activeDomain = domains.items.find(result => {
                    return result.referencedComponentId === this.route.snapshot.queryParamMap.get('domain');
                });
                this.domainService.setActiveDomain(this.activeDomain);
            }
        });
        this.setupAttributes();
    }

    setupAttributes() {
        this.terminologyService.getAttributes().subscribe(attributes => {
            this.attributeService.setAttributes(attributes);

            if (this.route.snapshot.queryParamMap.get('attribute')) {
                this.activeAttribute = attributes.items.find(result => {
                    return result.referencedComponentId === this.route.snapshot.queryParamMap.get('attribute');
                });
                this.attributeService.setActiveAttribute(this.activeAttribute);
                this.setupRanges();
            }
        });
    }

    setupRanges() {
        if (this.route.snapshot.queryParamMap.get('range')) {
            this.terminologyService.getRanges(this.activeAttribute.referencedComponentId).subscribe(ranges => {
                ranges.items = this.customOrder.transform(ranges.items, ['723596005', '723594008', '723593002', '723595009']);
                this.rangeService.setRanges(ranges);

                this.activeRange = ranges.items.find(result => {
                    return result.additionalFields.contentTypeId === this.route.snapshot.queryParamMap.get('range');
                });
                this.rangeService.setActiveRange(this.activeRange);
            });
        }
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
