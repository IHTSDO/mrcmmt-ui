import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DrawerService {

    private drawerOpen = new BehaviorSubject(false);

    constructor() {
    }

    setDrawerOpen(bool) {
        this.drawerOpen.next(bool);
    }

    getDrawerOpen() {
        return this.drawerOpen.asObservable();
    }
}
