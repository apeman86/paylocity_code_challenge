import { Component, SimpleChanges, Input } from '@angular/core';
import { ContextService } from '../services/context-service';
import { Employee } from '../models/employee';
import { Context } from '../models/context';
import { Dependent } from '../models/dependent';

@Component({
    selector: 'dependent',
    moduleId: module.id,
    templateUrl: '../templates/dependent.component.html'
})
export class DependentComponent {
    @Input()
    dependent: Dependent;
    @Input()
    context: Context;
    providedID: number;
    constructor ( private contextService: ContextService ) {
    }

    ngOnInit() {
        this.providedID = this.dependent.id;
        this.dependent.benefit_cost = this.context.dependent_benefit_costs;
    }

    save(): void {
        this.dependent.stored = true;
        if (this.dependent.firstName.toUpperCase().startsWith('A')) {
            this.dependent.discount = true;
        }
        let index = this.context.employee.dependents.findIndex(dependent => dependent.id === this.dependent.id);
        if (index === -1) {
            this.context.employee.dependents.push(this.dependent);
        } else {
            this.context.employee.dependents[index] = this.dependent;
        }
        this.context.updateEmployee(this.context.employee);
    }

    clear(): void {
        this.dependent = new Dependent();
        this.dependent.id = this.providedID;
        this.dependent.benefit_cost = this.context.dependent_benefit_costs;
    }

    cancel(): void {
        let index = this.context.employee.dependents.findIndex(dependent => dependent === this.dependent);
        if (index >= 0) {
            this.dependent.stored = true;
        } else {
            this.context.clearTempDependentSubject.next();
        }
    }

    edit(): void {
        this.dependent.stored = false;
    }

    remove(): void {
        let index = this.context.employee.dependents.findIndex(dependent => dependent === this.dependent);
        this.context.employee.dependents.splice(index, 1);
        this.context.updateEmployee(this.context.employee);
    }
}
