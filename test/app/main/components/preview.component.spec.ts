import { ContextService } from '../../../../src/app/main/services/context-service';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { PreviewComponent } from '../../../../src/app/main/components/preview.component';
import { TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../../../src/app/main/models/employee';
import { Dependent } from '../../../../src/app/main/models/dependent';

describe('preview.component', () => {
    let dataService: DataService = jasmine.createSpyObj('DataService', ['getBenefitsData']);
    let contextService: ContextService;
    let previewComponent: PreviewComponent;
    let updateEmployeeSpy;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockBackend, BaseRequestOptions, DataService,
                {
                provide: Http,
                useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backendInstance, defaultOptions);
                },
                deps: [MockBackend, BaseRequestOptions]
                },
            ]
        });
        dataService = TestBed.get(DataService);
        spyOn(dataService, 'getBenefitsData').and.returnValue(Observable.of({
            'employee': {
                'benefit_cost_per_year': 1000,
                'paycheck_value': 2600
            },
            'discount': 10,
            'dependent': {
                'benefit_cost_per_year': 500
            }
        }));
        contextService  = new ContextService(dataService);
        spyOn(contextService, 'isInitialized').and.returnValue(Observable.of({}));
        previewComponent = new PreviewComponent(contextService);
    });

    it('constructor - subscribes', () => {
        // Used to compare against the results of the calculations
        let result1 = '{"dependentsMonthlyCosts":[],"dependentsBiWeeklyCosts":[],"employeeName":"John Doe","discounted":"","biWeeklyPay":2600,"monthlyPay":5200,"biWeeklyCost":38.46,"monthlyCost":83.33,"biWeeklyTotalCost":38.46,"monthlyTotalCost":83.33}';
        let result2 = '{"dependentsMonthlyCosts":[{"discounted":"10%","dependentName":"Adam Doe","cost":37.5},{"discounted":"","dependentName":"Bob Doe","cost":41.67}],"dependentsBiWeeklyCosts":[{"discounted":"10%","dependentName":"Adam Doe","cost":17.31},{"discounted":"","dependentName":"Bob Doe","cost":19.23}],"employeeName":"Able Doe","discounted":"10%","biWeeklyPay":2600,"monthlyPay":5200,"biWeeklyCost":34.62,"monthlyCost":75,"biWeeklyTotalCost":71.16,"monthlyTotalCost":154.17}';
        let employee = new Employee();
        employee.benefit_cost = previewComponent.context.employee_benefit_costs;
        employee.discount = false;
        employee.firstName = 'John';
        employee.lastName = 'Doe';
        employee.paycheck = previewComponent.context.employee_paycheck_value;

        previewComponent.context.employeeSubject.next(employee);
        expect(JSON.stringify(previewComponent.calculatedCosts)).toEqual(result1);

        previewComponent.context.employeeSubject.next(undefined);
        expect(previewComponent.calculatedCosts).toBeUndefined();
        let dependent1 = new Dependent();
        dependent1.benefit_cost = previewComponent.context.dependent_benefit_costs;
        dependent1.firstName = 'Adam';
        dependent1.lastName = 'Doe';
        dependent1.discount = true;

        let dependent2 = new Dependent();
        dependent2.benefit_cost = previewComponent.context.dependent_benefit_costs;
        dependent2.firstName = 'Bob';
        dependent2.lastName = 'Doe';
        dependent2.discount = false;

        employee.dependents = [dependent1, dependent2];
        employee.firstName = 'Able';
        employee.discount = true;
        previewComponent.context.employeeSubject.next(employee);
        expect(JSON.stringify(previewComponent.calculatedCosts)).toBe(result2);
    });

    it('selectTab', () => {
        expect(previewComponent.selectedTab).toBe('biWeekly');
        previewComponent.selectTab('monthly');
        expect(previewComponent.selectedTab).toBe('monthly');
        // Should not happen in the UI, but doesn't hurt 
        previewComponent.selectTab(undefined);
        expect(previewComponent.selectedTab).toBeUndefined();
    });
});