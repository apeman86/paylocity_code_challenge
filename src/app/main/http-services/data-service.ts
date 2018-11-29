import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DataService {
    constructor(
        private http: Http
    ) {}

    getBenefitsData(): Observable<any> {
        return this.http.get('/data').map(res => res.json());
    }
}