import { Request, Response } from 'express';
import { DataService } from '../services/data-service';

const DATA_SERVICE = new DataService();

module.exports = function (app): void {
    app.get('/data', (req: Request, res: Response) => {
       let data = {};
        data['employee'] = DATA_SERVICE.getEmployeeData();
        data['discount'] = DATA_SERVICE.getDiscountData();
        data['dependent'] = DATA_SERVICE.getDependentData();
        res.send(data);
    });
};
