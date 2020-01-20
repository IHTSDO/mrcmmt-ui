import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RangeService {

    constructor() {
    }

    private ranges = new Subject<any>();

    setRanges(ranges) {
        console.log('RANGES: ', ranges);
        this.ranges.next(ranges);
    }

    collectRanges(): Observable<any> {
        return this.ranges.asObservable();
    }
}
