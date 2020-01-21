import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RangeService {

    constructor() {
    }

    private ranges = new Subject<any>();
    private activeRange = new Subject<any>();

    // Setters & Getters: Ranges
    setRanges(ranges) {
        console.log('RANGES: ', ranges);
        this.ranges.next(ranges);
    }

    clearRanges() {
        this.ranges.next();
    }

    getRanges(): Observable<any> {
        return this.ranges.asObservable();
    }

    // Setters & Getters: Active Range
    setActiveRange(range) {
        // console.log('ACTIVE RANGE: ', range);
        this.activeRange.next(range);
    }

    clearActiveRange() {
        this.activeRange.next();
    }

    getActiveRange(): Observable<any> {
        return this.activeRange.asObservable();
    }
}
