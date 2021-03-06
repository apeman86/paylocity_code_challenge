import { Employee } from './employee';
import { Subject ,  Observable } from 'rxjs';

export class Context {
    employee: Employee | undefined;
    employee_benefit_costs: number;
    employee_paycheck_value: number;
    dependent_benefit_costs: number;
    discount_percentage: number;
    employeeSubject: Subject<Employee>;
    employeeObservable: Observable<Employee>;
    clearTempDependentSubject: Subject<void>;
    clearTempDependentObservable: Observable<void>;
    constructor() {
        this.employeeSubject = new Subject<Employee>();
        this.employeeObservable = this.employeeSubject.asObservable();
        this.clearTempDependentSubject = new Subject<void>();
        this.clearTempDependentObservable = this.clearTempDependentSubject.asObservable();
    }

    updateEmployee(employee: Employee | undefined): void {
        this.employee = employee;
        this.employeeSubject.next(this.employee);
    }
}