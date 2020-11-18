import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { SnomedResponseObject } from '../models/snomedResponseObject';
import { BranchingService } from './branching.service';
import { map, catchError } from 'rxjs/operators';
import { SnomedUtilityService } from './snomedUtility.service';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    private branchPath: string;
    private branchPathSubscription: Subscription;

    constructor(private http: HttpClient,
                private authoringService: AuthoringService,
                private branchingService: BranchingService) {
        this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => this.branchPath = data);
    }

    getTypeahead(term) {
        const params = {
            termFilter: term,
            limit: 20,
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };
        return this.http
            .post(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath + '/concepts/search', params)
            .pipe(map(responseData => {
                const typeaheads = [];

                responseData['items'].forEach((item) => {
                    typeaheads.push(SnomedUtilityService.convertShortConceptToString(item));
                });

                return typeaheads;
            }));
    }

    getConcept(id): Observable<object> {
        return this.http.get<object>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath
            + '/concepts/' + id);
    }

    getVersions(showFutureVersions): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint +
        'codesystems/SNOMEDCT/versions?showFutureVersions=' + showFutureVersions);
    }

    getRangeConstraints(rangeConstraint): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint
            + this.branchPath + '/concepts?ecl=' + encodeURIComponent(rangeConstraint)).pipe(map(responseData => {
                return responseData;
            }),
            catchError(err => {
                return throwError(err);
            }));
    }

    getDomains(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (branchPath ? branchPath : this.branchPath) +
            '/members?referenceSet=723560006&active=true&limit=1000');
    }

    getAttributes(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (branchPath ? branchPath : this.branchPath) +
            '/members?referenceSet=723561005&active=true&limit=1000').pipe(map(response => {
                response.items.forEach(item => {
                    if (item.additionalFields.grouped) {
                        switch (item.additionalFields.grouped) {
                            case '0':
                                item.additionalFields.grouped = false;
                                break;
                            case '1':
                                item.additionalFields.grouped = true;
                                break;
                        }
                    }
                });
                return response;
        }));
    }

    getRanges(componentReferenceId, branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (branchPath ? branchPath : this.branchPath) +
            '/members?referenceSet=723562003&referencedComponentId=' + componentReferenceId + '&active=true&limit=1000');
    }

    getAttributeHierarchy(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + 'mrcm/' + this.branchPath +
            '/concept-model-attribute-hierarchy');
    }

    getAttributesWithConcreteDomains(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (branchPath ? branchPath : this.branchPath) +
            '/concepts?ecl=%3C%3C762706009');
    }

    putRefsetMember(member): Observable<SnomedResponseObject> {
        if (member.additionalFields.depth) {
            delete member.additionalFields.depth;
        }
        if (member.additionalFields.parentId) {
            delete member.additionalFields.parentId;
        }
        return this.http.put<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members/' + member.memberId, member);
    }

    postRefsetMember(member): Observable<SnomedResponseObject> {
        if (member.additionalFields.depth) {
            delete member.additionalFields.depth;
        }
        if (member.additionalFields.parentId) {
            delete member.additionalFields.parentId;
        }
        return this.http.post<SnomedResponseObject>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members', member);
    }

    deleteRefsetMember(member): Observable<any> {
        return this.http.delete<any>(
            this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + this.branchPath +
            '/members/' + member.memberId);
    }
}
