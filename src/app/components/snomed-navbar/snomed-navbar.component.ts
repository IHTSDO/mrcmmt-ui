import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-snomed-navbar',
    templateUrl: './snomed-navbar.component.html',
    styleUrls: ['./snomed-navbar.component.scss']
})
export class SnomedNavbarComponent implements OnInit {

    private environment: string;

    constructor() {
        this.environment = window.location.host.split(/[.]/)[0].split(/[-]/)[0];
    }

    ngOnInit() {
    }

}
