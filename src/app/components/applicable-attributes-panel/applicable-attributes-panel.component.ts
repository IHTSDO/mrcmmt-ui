import { Component, OnInit } from '@angular/core';
import { TerminologyServerService } from '../../services/terminologyServer.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-applicable-attributes-panel',
    templateUrl: './applicable-attributes-panel.component.html',
    styleUrls: ['./applicable-attributes-panel.component.scss']
})
export class ApplicableAttributesPanelComponent implements OnInit {

    // domains
    attributes: any[];

    // typehahead
    searchTerm: string;
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 2 ? []
                : this.terminologyService.getTypeahead(term, '< 762705008'))
        )

    constructor(private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
        this.attributes = [];
    }

    retrieveAttributes(input) {
        this.terminologyService.getConcept(input.replace(/[^0-9,]/g, '')).subscribe(
            data => {
                console.log('DATA: ', data);
                this.attributes.push(data);
            }
        );
    }
}
