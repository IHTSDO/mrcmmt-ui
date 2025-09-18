import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import {Observable, Subject} from 'rxjs';
import { AuthoringService } from './authoring.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private user = new Subject<User>();

    constructor(private http: HttpClient, private authoringService: AuthoringService) {
    }

    setUser(user) {
        this.user.next(user);
    }

    getUser() {
        return this.user.asObservable();
    }

    getLoggedInUser(): Observable<User> {
        return this.http.get<User>('/auth');
    }

    logout() {
        window.location.href =
            this.authoringService.uiConfiguration.endpoints.imsEndpoint + 'logout?serviceReferer=' + window.location.href;
    }
}
