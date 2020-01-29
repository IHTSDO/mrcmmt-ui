import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { SnomedResponseObject } from '../models/snomedResponseObject';
import { BranchingService } from './branching.service';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    private branchPath: string;
    private branchPathSubscription: Subscription;

    constructor(private http: HttpClient, private authoringService: AuthoringService, private branchingService: BranchingService) {
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => this.branchPath = data);
    }

    getVersions(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
        'codesystems/SNOMEDCT/versions');
    }

    getRangeConstraints(rangeConstraint): Observable<SnomedResponseObject> {
        const params = {
            eclFilter: rangeConstraint
        };

        return this.http.post<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/concepts/search', params);
    }

    getDomains(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members?referenceSet=723560006&active=true&limit=1000');
    }

    getAttributes(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members?referenceSet=723561005&active=true&limit=1000');
    }

    getRanges(componentReferenceId): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members?referenceSet=723562003&referencedComponentId=' + componentReferenceId + '&active=true&limit=1000');
    }

    putRefsetMember(member): Observable<SnomedResponseObject> {
        return this.http.put<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members/' + member.memberId, member);
    }

    postRefsetMember(member): Observable<SnomedResponseObject> {
        return this.http.post<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members', member);
    }
}
