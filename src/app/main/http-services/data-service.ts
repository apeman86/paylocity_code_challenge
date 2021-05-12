
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
    constructor(
        private http: Http
    ) {}

    getBenefitsData(): Observable<any> {
        return this.http.get('/data').pipe(map(res => res.json()));
    }
}