import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { map } from 'rxjs/operators';
import { RefSet } from '../models/refset';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    constructor(private http: HttpClient, private authoringService: AuthoringService) {
    }

    getRangeConstraints(rangeConstraint): Observable<any[]> {
        const params = {
            eclFilter: rangeConstraint
        };

        return this.http.post(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/concepts/search', params).pipe(map(data => {
                const response = [];

                data['items'].forEach((item) => {
                    response.push(item);
                });

                return response;
            }));
    }

    getDomains(): Observable<RefSet[]> {
        return this.http.get<RefSet[]>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723560006').pipe(map(data => {
                const response = [];

                data['items'].forEach((item) => {
                    response.push(item);
                });

                return response;
            }));
    }

    getAttributes(): Observable<RefSet[]> {
        return this.http.get<RefSet[]>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723561005').pipe(map(data => {
                const response = [];

                data['items'].forEach((item) => {
                    response.push(item);
                });

                return response;
            }));
    }

    getRanges(componentReferenceId): Observable<RefSet[]> {
        return this.http.get<RefSet[]>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723562003&referencedComponentId=' + componentReferenceId).pipe(map(data => {
                const response = [];

                data['items'].forEach((item) => {
                    response.push(item);
                });

                return response;
            }));
    }
}
