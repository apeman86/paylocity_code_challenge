import { Employee } from './employee';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class Context {
    employee: Employee | undefined;
    employee_benefit_costs: number;
    employee_paycheck_value: number;
    dependent_benefit_costs: number;
    discount_percentage: number;
    employeeSubject: Subject<Employee>;
    employeeObservable: Observable<Employee>;
    constructor() {
        this.employeeSubject = new Subject<Employee>();
        this.employeeObservable = this.employeeSubject.asObservable();
    }

    updateEmployee(employee: Employee | undefined): void {
        this.employee = employee;
        this.employeeSubject.next(this.employee);
    }
}