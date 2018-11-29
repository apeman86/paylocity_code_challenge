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
    constructor ( private contextService: ContextService ) {
    }

    ngOnInit() {
        this.dependent.benefit_cost = this.context.dependent_benefit_costs;
    }

    save(): void {
        this.dependent.stored = true;
        this.context.employee.dependents.push(this.dependent);
        this.context.updateEmployee(this.context.employee);
    }

    clear(): void {
        this.dependent = new Dependent();
        this.dependent.benefit_cost = this.context.dependent_benefit_costs;
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
