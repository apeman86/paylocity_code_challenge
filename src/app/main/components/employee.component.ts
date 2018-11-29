import { Component, SimpleChanges } from '@angular/core';
import { ContextService } from '../services/context-service';
import { Employee } from '../models/employee';
import { Context } from '../models/context';
import { Dependent } from '../models/dependent';

@Component({
    selector: 'employee',
    moduleId: module.id,
    templateUrl: '../templates/employee.component.html'
})
export class EmployeeComponent {
    lastKey = 0;
    employee: Employee = new Employee();
    tempDependent: Dependent;
    public context: Context;
    constructor (
        private contextService: ContextService
    ) {
        this.contextService.isInitialized().subscribe(() => {
            this.context = this.contextService.getContext();
            this.employee.benefit_cost = this.context.employee_benefit_costs;
            this.employee.paycheck = this.context.employee_paycheck_value;
            this.context.employeeObservable.subscribe(employee => {
                if (!employee) {
                    this.employee = new Employee();
                    this.employee.benefit_cost = this.context.employee_benefit_costs;
                    this.employee.paycheck = this.context.employee_paycheck_value;
                    this.tempDependent = undefined;
                } else {
                    this.tempDependent = undefined;
                }
            });
            this.context.clearTempDependentObservable.subscribe(() => {
                this.tempDependent = undefined;
            });
        });
    }

    save(): void {
        this.employee.stored = true;
        if (this.employee.firstName.toUpperCase().startsWith('A')) {
            this.employee.discount = true;
        }
        this.context.updateEmployee(this.employee);
    }

    clear(): void {
        this.context.updateEmployee(undefined);
    }

    edit(): void {
        this.employee.stored = false;
        if (this.tempDependent) {
            this.tempDependent = undefined;
        }
    }

    addDependent(): void {
        if (!this.tempDependent) {
            this.tempDependent = new Dependent();
            this.tempDependent.id = this.lastKey++;
        }
    }

}
