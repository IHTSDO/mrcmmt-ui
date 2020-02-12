import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthoringService } from './authoring.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient, private authoringService: AuthoringService) {
    }

    getLoggedInUser(): Observable<User> {
        return this.http.get<User>('/auth');
    }

    logout() {
        window.location.href =
            this.authoringService.uiConfiguration.endpoints.imsEndpoint + 'logout?serviceReferer=' + window.location.href;
    }
}
