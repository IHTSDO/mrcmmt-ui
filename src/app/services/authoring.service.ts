import { Injectable } from '@angular/core';
import { UIConfiguration } from '../models/uiConfiguration';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Versions } from '../models/versions';

@Injectable({
    providedIn: 'root'
})
export class AuthoringService {

    public environmentEndpoint: string;
    uiConfiguration: UIConfiguration;

    constructor(private http: HttpClient) {
        this.environmentEndpoint = window.location.origin + '/';
    }

    getProjects(): Observable<object[]> {
        return this.http.get<object[]>('/authoring-services/projects?lightweight=true');
    }

    getUIConfiguration(): Observable<UIConfiguration> {
        return this.http.get<UIConfiguration>('/authoring-services/ui-configuration');
    }

    getSnowowlConfiguration(): Observable<UIConfiguration> {
        return this.http.get<UIConfiguration>('/config/endpointConfig.json');
    }

    getVersion(): Observable<Versions> {
        return this.http.get<Versions>('/config/versions.json');
    }
}
