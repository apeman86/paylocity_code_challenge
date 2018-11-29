import { TestBed } from '@angular/core/testing';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { Context } from '../../../../src/app/main/models/context';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { Observable } from 'rxjs/Rx';
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
        dependentComponent = new DependentComponent(contextService);
        dependentComponent.dependent = new Dependent();
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
        updateEmployeeSpy = spyOn(dependentComponent.context, 'updateEmployee').and.stub();
        dependentComponent.save();
        expect(dependentComponent.dependent.stored).toBe(true);
        expect(updateEmployeeSpy).toHaveBeenCalled();

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

});