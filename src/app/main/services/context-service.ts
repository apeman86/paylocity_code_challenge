import { Injectable } from '@angular/core';
import { Context } from '../models/context';
import { Observable } from 'rxjs/Rx';
import { Employee } from '../models/employee';

@Injectable()
export class ContextService {
    context: Context;

    constructor() {
        this.context = new Context();
    }

    clear(): void {
        this.context.updateEmployee(undefined);
    }

    getEmployee(): Observable<Employee> {
        return this.context.employeeObservable;
    }

    setEmployee(employee: Employee): void {
        this.context.updateEmployee(employee);
    }

    getContext(): Context {
        return this.context;
    }

}