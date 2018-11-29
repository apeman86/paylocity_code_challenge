import { Component } from '@angular/core';
import { Context } from '../models/context';
import { ContextService } from '../services/context-service';
import { CalculatedCosts } from '../models/calculated-costs';
import { Dependent } from '../models/dependent';

@Component({
    selector: 'preview',
    moduleId: module.id,
    templateUrl: '../templates/preview.component.html'
})
export class PreviewComponent {
    calculatedCosts: CalculatedCosts;
    public context: Context;
    selectedTab: string = 'biWeekly';
    constructor (
        private contextService: ContextService
    ) {
        this.contextService.isInitialized().subscribe(() => {
            this.context = this.contextService.getContext();
            this.context.employeeObservable.subscribe(employee => {
                if (employee) {
                    this.calculatedCosts = new CalculatedCosts();
                    this.calculatedCosts.employeeName = `${employee.firstName} ${employee.lastName}`;
                    this.calculatedCosts.discounted = employee.discount ? `${this.context.discount_percentage}%` : '';
                    this.calculatedCosts.biWeeklyPay = parseFloat((employee.paycheck).toFixed(2));
                    this.calculatedCosts.monthlyPay = parseFloat((employee.paycheck * 2).toFixed(2));
                    this.calculatedCosts.biWeeklyCost = parseFloat(employee.discount ? ((employee.benefit_cost / 26) * ((100 - this.context.discount_percentage) / 100)).toFixed(2) : (employee.benefit_cost / 26).toFixed(2));
                    this.calculatedCosts.monthlyCost = parseFloat(employee.discount ? ((employee.benefit_cost / 12) * ((100 - this.context.discount_percentage) / 100)).toFixed(2) : (employee.benefit_cost / 12).toFixed(2));
                    let totalBiWeeklyCost = this.calculatedCosts.biWeeklyCost;
                    let totalMonthlyCost = this.calculatedCosts.monthlyCost;
                    employee.dependents.forEach(dependent => {
                        let biWeeklyCost = parseFloat(dependent.discount ? ((dependent.benefit_cost / 26) * ((100 - this.context.discount_percentage) / 100)).toFixed(2) : (dependent.benefit_cost / 26).toFixed(2));
                        let monthlyCost = parseFloat(dependent.discount ? ((dependent.benefit_cost / 12) * ((100 - this.context.discount_percentage) / 100)).toFixed(2) : (dependent.benefit_cost / 12).toFixed(2));
                        this.calculatedCosts.dependentsBiWeeklyCosts.push({discounted: dependent.discount ? `${this.context.discount_percentage}%` : '', dependentName: `${dependent.firstName} ${dependent.lastName}`, cost: biWeeklyCost});
                        this.calculatedCosts.dependentsMonthlyCosts.push({discounted: dependent.discount ? `${this.context.discount_percentage}%` : '', dependentName: `${dependent.firstName} ${dependent.lastName}`, cost: monthlyCost});
                        totalBiWeeklyCost += biWeeklyCost;
                        totalMonthlyCost += monthlyCost;
                    });
                    this.calculatedCosts.biWeeklyTotalCost = parseFloat((totalBiWeeklyCost).toFixed(2));
                    this.calculatedCosts.monthlyTotalCost = parseFloat((totalMonthlyCost).toFixed(2));
                } else {
                    this.calculatedCosts = undefined;
                }
            });
        });
    }

    selectTab(tab: string) {
        this.selectedTab = tab;
    }
}
