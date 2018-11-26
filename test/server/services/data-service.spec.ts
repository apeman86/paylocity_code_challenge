import { DataService } from '../../../src/server/services/data-service';
import { EmployeeData } from '../../../src/server/models/employee';
import { DependentData } from '../../../src/server/models/dependent';
import * as chai from 'chai';

let expect = chai.expect;

describe('data-service', () => {
    let dataService: DataService;
    beforeEach(() => {
        dataService = new DataService();
    });

    it('getEmployeeData', () => {
        let employee: EmployeeData = dataService.getEmployeeData();
        expect(employee.benefit_cost_per_year).to.equal(1000);
        expect(employee.paycheck_value).to.equal(2600);
    });

    it('getDiscountData', () => {
        let discount: number = dataService.getDiscountData();
        expect(discount).to.equal(10);
    });

    it('getDependentData', () => {
        let dependent: DependentData = dataService.getDependentData();
        expect(dependent.benefit_cost_per_year).to.equal(500);
    });
});