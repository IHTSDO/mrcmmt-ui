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
}
