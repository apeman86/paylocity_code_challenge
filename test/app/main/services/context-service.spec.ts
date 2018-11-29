import { TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { Employee } from '../../../../src/app/main/models/employee';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { Observable } from 'rxjs/Rx';

describe('context-service', () => {
    let benefitData = {
        'employee': {
            'benefit_cost_per_year': 1000,
            'paycheck_value': 2600
        },
        'discount': 10,
        'dependent': {
            'benefit_cost_per_year': 500
        }
    };
    let contextService: ContextService;
    let dataService: DataService;
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
        contextService = new ContextService(dataService);
        spyOn(dataService, 'getBenefitsData').and.returnValue(Observable.of(benefitData));
    });

    it('getContext()', () => {
        let context = contextService.getContext();
        expect(context.employee).toBe(undefined);
    });

    it('setEmployee/getEmployee/clear', () => {
        let employee = new Employee();
        employee.firstName = 'John';
        employee.lastName = 'Doe';
        let getEmp = contextService.getEmployee().subscribe(employee => {
            expect(employee).not.toBeUndefined();
            expect(employee.firstName).toBe('John');
            expect(employee.lastName).toBe('Doe');
        });
        contextService.setEmployee(employee);
        getEmp.unsubscribe();

        getEmp = contextService.getEmployee().subscribe(employee => {
            expect(employee).toBeUndefined();
        });
        contextService.clear();
    });

    it('updateBenefitsData', () => {
        let benefitData = {
            'employee': {
                'benefit_cost_per_year': 1000,
                'paycheck_value': 2600
            },
            'discount': 10,
            'dependent': {
                'benefit_cost_per_year': 500
            }
        };
        contextService.updateBenefitsData(benefitData);
        let context = contextService.getContext();
        expect(context.employee_benefit_costs).toBe(1000);
        expect(context.employee_paycheck_value).toBe(2600);
        expect(context.dependent_benefit_costs).toBe(500);
        expect(context.discount_percentage).toBe(10);
    });

    it('isInitialized', () => {
        contextService.isInitialized().subscribe(() => {
            expect(true).toBeTruthy();
        });
        contextService.initialized.next();
    });
});