import { MainApp } from '../../../../src/app/main/components/main-app';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { DataService } from '../../../../src/app/main/http-services/data-service';
import { TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

describe('main-app', () => {
    let dataService: DataService = jasmine.createSpyObj('DataService', ['getBenefitsData']);

    let contextService: ContextService;
    let mainApp: MainApp;
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
        mainApp = new MainApp(contextService);
    });

    it('clear', () => {
        let clearSpy = spyOn(contextService, 'clear').and.stub();
        mainApp.clear();
        expect(clearSpy).toHaveBeenCalled();
    });
});