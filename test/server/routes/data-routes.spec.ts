import * as chai from 'chai';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import * as express from 'express';
import { DataService } from '../../../src/server/services/data-service';

let app = express();
require('../../../src/server/routes/data-routes')(app);
let request = supertest(app);

let expect = chai.expect;

describe('data-routes', () => {
    it('/data', (done) => {
        request.get('/data')
            .expect(200)
            .end((err, res) => {
                expect(res.body.employee.benefit_cost_per_year).to.equal(1000);
                expect(res.body.employee.paycheck_value).to.equal(2600);
                expect(res.body.discount).to.equal(10);
                expect(res.body.dependent.benefit_cost_per_year).to.equal(500);
                done();
            });
    });
});