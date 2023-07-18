import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { AuthoringService } from './authoring.service';
import { SnomedResponseObject } from '../models/snomedResponseObject';
import { BranchingService } from './branching.service';
import {map, catchError, debounceTime, distinctUntilChanged, filter, delay} from 'rxjs/operators';
import { SnomedUtilityService } from './snomedUtility.service';
import {PathingService} from './pathing/pathing.service';

@Injectable({
    providedIn: 'root'
})
export class TerminologyServerService {

    // private branchPath: string;
    // private branchPathSubscription: Subscription;
    activeBranch: any;
    activeBranchSubscription: Subscription;
    activeProject: any;
    activeProjectSubscription: Subscription;

    constructor(private http: HttpClient,
                private authoringService: AuthoringService,
                private branchingService: BranchingService,
                private pathingService: PathingService) {
        this.activeBranchSubscription = this.pathingService.getActiveBranch().subscribe(data => this.activeBranch = data);
        this.activeProjectSubscription = this.pathingService.getActiveProject().subscribe(data => this.activeProject = data);
        // this.branchPathSubscription = this.branchingService.getBranchPath().subscribe(data => this.branchPath = data);
    }

    getTypeahead(term) {
        const params = {
            termFilter: term,
            limit: 20,
            expand: 'fsn()',
            activeFilter: true,
            termActive: true
        };
        return this.http.post(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concepts/search', params)
            .pipe(map((responseData: any) => {
                const typeaheads = [];

                responseData['items'].forEach((item) => {
                    typeaheads.push(SnomedUtilityService.convertShortConceptToString(item));
                });

                return typeaheads;
            }));
    }

    getConcept(id): Observable<any> {
        return this.http.get<any>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concepts/' + id);
    }

    getVersions(showFutureVersions) {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + 'codesystems/SNOMEDCT/versions?showFutureVersions=' + showFutureVersions).pipe(map(responseData => {
            return responseData.items;
        }));
    }

    getRangeConstraints(rangeConstraint): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concepts?ecl=' + encodeURIComponent(rangeConstraint)).pipe(map(responseData => {
                return responseData;
            }),
            catchError(err => {
                return throwError(err);
            }));
    }

    getRangeConstraintsWithTerm(rangeConstraint, term) {
        return this.http.get(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concepts?ecl=' + encodeURIComponent(rangeConstraint) + '&term=' + term);
    }

    getDomains(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members?referenceSet=723560006&active=true&limit=1000');
    }

    getAttributes(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members?referenceSet=723561005&active=true&limit=1000').pipe(map(response => {
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
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members?referenceSet=723562003&referencedComponentId=' + componentReferenceId + '&active=true&limit=1000');
    }

    getAttributeHierarchy(): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + 'mrcm/' + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concept-model-attribute-hierarchy');
    }

    getAttributesWithConcreteDomains(branchPath?: string): Observable<SnomedResponseObject> {
        return this.http.get<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/concepts?ecl=%3C%3C762706009');
    }

    putRefsetMember(member): Observable<SnomedResponseObject> {
        if (member.additionalFields.depth) {
            delete member.additionalFields.depth;
        }
        if (member.additionalFields.parentId) {
            delete member.additionalFields.parentId;
        }
        return this.http.put<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members/' + member.memberId, member);
    }

    postRefsetMember(member): Observable<SnomedResponseObject> {
        if (member.additionalFields.depth) {
            delete member.additionalFields.depth;
        }
        if (member.additionalFields.parentId) {
            delete member.additionalFields.parentId;
        }
        return this.http.post<SnomedResponseObject>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members', member);
    }

    deleteRefsetMember(member): Observable<any> {
        return this.http.delete<any>(this.authoringService.uiConfiguration.endpoints.terminologyServerEndpoint + (this.activeBranch ? this.activeBranch.branchPath : '') + (this.activeProject ? '/' + this.activeProject.key : '') + '/members/' + member.memberId);
    }
}
