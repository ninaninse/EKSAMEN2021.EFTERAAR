const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/controllers/user-controller');

chai.use(chaiHttp);

describe('API', () => {
    describe('GET /users', () => {
        it('should return an array', (done) => {
            chai
            .request(app)
            .get('/users')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body.lenght).to.equal(2);
                done();
            });
        });
    });
});