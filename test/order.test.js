const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
// const envData = require('../../data/envData');
// const tokenAuthData = require('../../data/tokenAuthData');

const server = require('../index.js');

var dummyOrder =  {
    "token":"2",
    "items": [
        {
            "orderid": "1",
            "quantity": 2
        },
        {
            "orderid": "2",
            "quantity": 4
        }
    ],
    "instruction": "add utensils",
    "payementMode": "COD",
    "restID": "100",
}

describe ('POST /api/order', function() {

    it ('Should Succeed order placing', function(done) {
        request(server)
            .post('/api/order/placeOrder/')
            .set('Content-type', 'application/json')
            .send(dummyOrder)
            .expect(201)
            .end(function(err, res) {
                expect(res.body).to.have.property('message').to.equal('Order placed.');
                done(err);
          });
        });
  

});