import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    constructor(private http: HttpClient, private authoringService: AuthoringService) {
    }

    getTypeahead(term, ecl?) {
        const params = {
            termFilter: term,
            limit: 20,
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };

        if (ecl) {
            params['eclFilter'] = ecl;
        }

        return this.http
            .post(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
                'MAIN/concepts/search', params)
            .pipe(map(responseData => {
                const typeaheads = [];

                responseData['items'].forEach((item) => {
                    typeaheads.push(item.id + ' |' + item.fsn.term + '|');
                });

                return typeaheads;
            }));
    }

    getDomains(input): Observable<any> {

        const params = {
            conceptIds: input,
            limit: 100,
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };

        return this.http.post<any>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/concepts/search', params).pipe(map(data => {
            const response = [];

            data['items'].forEach((item) => {
                response.push(item);
            });

            return response;
        }));
    }

    getConcept(id): Observable<any> {
        return this.http.get<any>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + 'MAIN/concepts/' + id);
    }

    getConceptsById(idList): Observable<object> {

        const params = {
            conceptIds: idList,
            limit: 100,
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };

        if (this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint.includes('snowowl')) {
            delete params.termActive;
        }

        return this.http.post<object>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/concepts/search', params);
    }

    getAttributes(): Observable<any> {

        const params = {
            limit: 100,
            eclFilter: '< 762705008',
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };

        return this.http.post<any>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/concepts/search', params).pipe(map(data => {
                const response = [];

                data['items'].forEach((item) => {
                    response.push(item);
                });

                return response;
            }));
    }
}
