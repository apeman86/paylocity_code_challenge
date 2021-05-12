
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { Context } from '../../../../src/app/main/models/context';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { DependentComponent } from '../../../../src/app/main/components/dependent.component';
import { Dependent } from '../../../../src/app/main/models/dependent';
import { Employee } from '../../../../src/app/main/models/employee';

describe('dependent.component', () => {
    let dataService: DataService = jasmine.createSpyObj('DataService', ['getBenefitsData']);

    let contextService: ContextService;
    let dependentComponent: DependentComponent;
    let updateEmployeeSpy;
    let employee;
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
        dependentComponent = new DependentComponent(contextService);
        dependentComponent.dependent = new Dependent();
        dependentComponent.dependent.id = 4;
    });

    it('ngOnInit', () => {
        // simulate the @Input of Angular
        dependentComponent.context = contextService.getContext();
        dependentComponent.ngOnInit();
        expect(dependentComponent.dependent.benefit_cost).toBe(500);
    });

    it('save/edit', () => {
        dependentComponent.context = contextService.getContext();
        dependentComponent.context.employee = new Employee();
        let dependent1 = new Dependent();
        dependent1.id = 1;
        dependent1.firstName = 'Bob';
        let dependent2 = new Dependent();
        dependent2.id = 2;
        dependent2.firstName = 'Joe';
        let dependent3 = new Dependent();
        dependent3.id = 3;
        dependent3.firstName = 'Joe';
        dependentComponent.context.employee.dependents = [dependent1, dependent2, dependent3];
        dependentComponent.dependent.firstName = 'Adam';
        updateEmployeeSpy = spyOn(dependentComponent.context, 'updateEmployee').and.stub();
        dependentComponent.save();
        expect(dependentComponent.dependent.stored).toBe(true);
        expect(dependentComponent.dependent.discount).toBe(true);
        expect(updateEmployeeSpy).toHaveBeenCalled();
        // make a copy so the array doesn't already have the changes.
        dependentComponent.dependent = JSON.parse(JSON.stringify(dependent2));
        dependentComponent.dependent.firstName = 'Joey';
        dependentComponent.save();
        expect(dependentComponent.context.employee.dependents[1].id).toBe(2);
        expect(dependentComponent.context.employee.dependents[1].firstName).toBe('Joey');

        dependentComponent.edit();
        expect(dependentComponent.dependent.stored).toBe(false);
    });

    it('clear', () => {
        dependentComponent.context = contextService.getContext();
        dependentComponent.clear();
    });

    it('remove', () => {
        let dependent1 = new Dependent();
        let dependent2 = new Dependent();
        let dependent3 = new Dependent();
        dependentComponent.context = contextService.getContext();
        dependentComponent.context.employee = new Employee();
        dependentComponent.dependent = dependent2;
        dependentComponent.context.employee.dependents = [dependent1, dependent2, dependent3];
        dependentComponent.remove();
        expect(dependentComponent.context.employee.dependents.length).toBe(2);
        expect(dependentComponent.context.employee.dependents[1]).toEqual(dependent3);
    });

    it('cancel', () => {
        let dependent1 = new Dependent();
        let dependent2 = new Dependent();
        let dependent3 = new Dependent();
        dependentComponent.context = contextService.getContext();
        let clearTempSpy = spyOn(dependentComponent.context.clearTempDependentSubject, 'next');
        dependentComponent.context.employee = new Employee();
        dependentComponent.dependent = dependent2;
        dependentComponent.context.employee.dependents = [dependent1, dependent2, dependent3];
        dependentComponent.cancel();
        expect(dependentComponent.dependent.stored).toBe(true);
        dependentComponent.dependent = new Dependent();
        dependentComponent.cancel();
        expect(clearTempSpy).toHaveBeenCalled();

    });

});