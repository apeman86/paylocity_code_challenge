import * as config from 'config';
import { EmployeeData } from '../models/employee';
import { DependentData } from '../models/dependent';

export class DataService {
    employee_data: any = config.get('employee');
    discount: number = Number(config.get('discount_percentage'));
    dependent_data: any = config.get('dependent');
    getEmployeeData(): EmployeeData {
        let employeeData: EmployeeData = new EmployeeData();
        employeeData.benefit_cost_per_year = Number(this.employee_data.benefit_costs_per_year);
        employeeData.paycheck_value = Number(this.employee_data.paycheck_value);
        return employeeData;
    }

    getDiscountData(): number {
        return this.discount;
    }

    getDependentData(): DependentData {
        let dependentData: DependentData = new DependentData();
        dependentData.benefit_cost_per_year = Number(this.dependent_data.benefit_costs_per_year);
        return dependentData;
    }

}