import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnomedResponseObject } from '../models/snomedResponseObject';
import { UrlParamsService } from './url-params.service';

@Injectable({
    providedIn: 'root'
})
export class BranchingService {

    constructor(private urlParamsService: UrlParamsService) {
    }

    private branchPath = new Subject<string>();
    private versions = new Subject<SnomedResponseObject>();
    private latestReleaseBranchPath: string;

    // Setters & Getters: BranchPath
    setBranchPath(path) {
        this.urlParamsService.updateBranchParam(path);
        this.branchPath.next(path);
    }

    getBranchPath(): Observable<string> {
        return this.branchPath.asObservable();
    }

    // Setters & Getters: Versions
    setVersions(versions) {
        this.versions.next(versions);
    }

    getVersions() {
        return this.versions.asObservable();
    }

    // Setters & Getters: Latest Release BranchPath
    setLatestReleaseBranchPath(path) {
        this.latestReleaseBranchPath = path;
    }

    getLatestReleaseBranchPath() {
        return this.latestReleaseBranchPath;
    }
}
