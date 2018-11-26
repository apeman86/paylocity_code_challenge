import { TestBed } from '@angular/core/testing';
import { ContextService } from '../../../../src/app/main/services/context-service';
import { Employee } from '../../../../src/app/main/models/employee';


describe('context-service', () => {
    let contextService: ContextService;
    beforeEach(() => {
        contextService = new ContextService();
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
});