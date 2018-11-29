export class CalculatedCosts {
    employeeName: string;
    discounted: string;
    monthlyPay: number;
    biWeeklyPay: number;
    monthlyCost: number;
    biWeeklyCost: number;
    dependentsMonthlyCosts: Array<{discounted: string, dependentName: string, cost: number}> = [];
    dependentsBiWeeklyCosts: Array<{discounted: string, dependentName: string, cost: number}> = [];
    monthlyTotalCost: number;
    biWeeklyTotalCost: number;
}