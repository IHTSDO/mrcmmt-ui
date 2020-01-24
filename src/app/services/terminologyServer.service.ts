import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { SnomedResponseObject } from '../models/snomedResponseObject';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    constructor(private http: HttpClient, private authoringService: AuthoringService) {
    }

    getRangeConstraints(rangeConstraint): Observable<SnomedResponseObject> {
        const params = {
            eclFilter: rangeConstraint
        };

        return this.http.post<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/concepts/search', params);
    }

    getDomains(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723560006&active=true&limit=1000');
    }

    getAttributes(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723561005&active=true&limit=1000');
    }

    getRanges(componentReferenceId): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/members?referenceSet=723562003&referencedComponentId=' + componentReferenceId + '&active=true&limit=1000');
    }

    putRefsetMember(member): Observable<SnomedResponseObject> {
        return this.http.put<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/MRCMMAINT1/members/' + member.memberId, member);
    }

    postRefsetMember(member): Observable<SnomedResponseObject> {
        return this.http.post<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
            'MAIN/MRCMMAINT1/members', member);
    }
}
