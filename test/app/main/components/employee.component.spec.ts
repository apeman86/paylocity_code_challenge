
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { Context } from '../../../../src/app/main/models/context';
import { EmployeeComponent } from '../../../../src/app/main/components/employee.component';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { Dependent } from '../../../../src/app/main/models/dependent';

describe('employee.component', () => {
    let dataService: DataService = jasmine.createSpyObj('DataService', ['getBenefitsData']);

    let contextService: ContextService;
    let employeeComponent: EmployeeComponent;
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
        spyOn(dataService, 'getBenefitsData').and.returnValue(observableOf({
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
        spyOn(contextService, 'isInitialized').and.returnValue(observableOf({}));
        employeeComponent = new EmployeeComponent(contextService);
    });

    it('constructor', () => {
        expect(employeeComponent.employee.benefit_cost).toBe(1000);
        expect(employeeComponent.employee.paycheck).toBe(2600);

        employeeComponent.employee.paycheck = 11;
        employeeComponent.employee.benefit_cost = 3;
        employeeComponent.context.updateEmployee(employeeComponent.employee);
        expect(employeeComponent.employee.benefit_cost).toBe(3);
        expect(employeeComponent.employee.paycheck).toBe(11);

        employeeComponent.clear();
        expect(employeeComponent.employee.benefit_cost).toBe(1000);
        expect(employeeComponent.employee.paycheck).toBe(2600);

        employeeComponent.tempDependent = new Dependent();
        employeeComponent.context.clearTempDependentSubject.next();
        expect(employeeComponent.tempDependent).toBeUndefined();
    });

    it('save/edit', () => {
        updateEmployeeSpy = spyOn(employeeComponent.context, 'updateEmployee').and.stub();
        employeeComponent.save();
        expect(employeeComponent.employee.stored).toBe(true);
        expect(updateEmployeeSpy).toHaveBeenCalled();

        employeeComponent.edit();
        expect(employeeComponent.employee.stored).toBe(false);

        employeeComponent.employee.firstName = 'A';
        employeeComponent.save();
        expect(employeeComponent.employee.discount).toBe(true);
        expect(employeeComponent.employee.stored).toBe(true);

        employeeComponent.tempDependent = new Dependent();
        employeeComponent.edit();
        expect(employeeComponent.tempDependent).toBeUndefined();
        expect(employeeComponent.employee.stored).toBe(false);
    });

    it('clear', () => {
        updateEmployeeSpy = spyOn(employeeComponent.context, 'updateEmployee').and.stub();
        employeeComponent.clear();
        expect(updateEmployeeSpy).toHaveBeenCalledWith(undefined);
    });

    it('addDependent', () => {
        expect(employeeComponent.tempDependent).toBeUndefined();
        employeeComponent.addDependent();
        expect(employeeComponent.tempDependent).toBeDefined();
        expect(employeeComponent.tempDependent.id).toBe(0);
        employeeComponent.addDependent();
        expect(employeeComponent.tempDependent.id).toBe(0);
    });

    // it('')

});