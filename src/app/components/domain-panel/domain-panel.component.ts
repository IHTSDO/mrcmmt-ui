import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TerminologyServerService } from '../../services/terminologyServer.service';

@Component({
    selector: 'app-domain-panel',
    templateUrl: './domain-panel.component.html',
    styleUrls: ['./domain-panel.component.scss']
})
export class DomainPanelComponent implements OnInit {

    // domains
    domains: any[];

    // typehahead
    searchTerm: string;
    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => term.length < 2 ? []
                : this.terminologyService.getTypeahead(term))
        )

    constructor(private terminologyService: TerminologyServerService) {
    }

    ngOnInit() {
        this.domains = [];
    }

    retrieveDomains(input): void {
        this.terminologyService.getConcept(input.replace(/[^0-9,]/g, '')).subscribe(
            data => {
                console.log('DATA: ', data);
                this.domains.push(data);
            }
        );
    }
}
