var superagent = require('superagent');
var should = require('should');

describe('App', function() {

    describe('should get index', function() {
        it('get /', function(done) {
            superagent
            .get('http://localhost:3000/')
            .end(function(err, res) {
                done();
            })
        });
    })

})