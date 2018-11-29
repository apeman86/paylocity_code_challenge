import { Dependent } from './dependent';

export class Employee {
    firstName: string = '';
    lastName: string = '';
    paycheck: number;
    benefit_cost: number;
    discount: boolean = false;
    dependents: Array<Dependent> = new Array<Dependent>();
    stored: boolean = false;
}