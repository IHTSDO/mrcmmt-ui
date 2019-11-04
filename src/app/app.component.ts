import { Component, OnInit } from '@angular/core';
import { AuthoringService } from './services/authoring.service';
import { Versions } from './models/versions';
import { TerminologyServerService } from './services/terminologyServer.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    environment: string;
    versions: Versions;

    attributes: any[];

    constructor(private authoringService: AuthoringService, private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];

        this.authoringService.getVersion().subscribe(
            data => {
                this.versions = data;

                console.log('Snowstorm Version:', data.versions['snowstorm']);
            }
        );

        this.authoringService.getUIConfiguration().subscribe(data => {
            this.authoringService.uiConfiguration = data;
        });
    }
}
