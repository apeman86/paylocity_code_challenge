import { Injectable } from '@angular/core';
import { Context } from '../models/context';
import { Observable, Subject } from 'rxjs/Rx';
import { Employee } from '../models/employee';
import { DataService } from '../http-services/data-service';

@Injectable()
export class ContextService {
    context: Context;

    initialized: Subject<void> = new Subject<void>();

    constructor(private dataService: DataService) {
        this.context = new Context();
        dataService.getBenefitsData().subscribe(data => {
            this.updateBenefitsData(data);
            this.initialized.next();
        });
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

    isInitialized(): Observable<void> {
        return this.initialized.asObservable();
    }

    updateBenefitsData(data: any) {
        this.context.employee_benefit_costs = data.employee.benefit_cost_per_year;
        this.context.dependent_benefit_costs = data.dependent.benefit_cost_per_year;
        this.context.employee_paycheck_value = data.employee.paycheck_value;
        this.context.discount_percentage = data.discount;
    }

}