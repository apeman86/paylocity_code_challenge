import { TestBed, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DataService } from '../../../../src/app/main/http-services/data-service';

describe('data-service', () => {
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
      });

    it('getBenefitsData', (inject([DataService, MockBackend], (dataService: DataService, mockBackend: MockBackend) => {
        let returnData = {
            'employee': {
                'benefit_cost_per_year': 1000,
                'paycheck_value': 2600
            },
            'discount': 10,
            'dependent': {
                'benefit_cost_per_year': 500
            }
        };
        mockBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe('/data');
            expect(connection.request.method).toBe(RequestMethod.Get);
            connection.mockRespond(new Response(new ResponseOptions({
                status: 200,
                body: JSON.stringify(returnData)
            })));
        });

        dataService.getBenefitsData().subscribe(data => {
            expect(data).toEqual(returnData);
        });
    })));
});