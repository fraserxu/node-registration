var superagent = require('superagent');
var should = require('should');

describe('App', function() {

    describe('should get index', function() {
        it('get /', function(done) {
            superagent
            .get('http://localhost:3000/')
            .end(function(err, res) {
                res.should.have.status(200);
                return done();
            });
        });
    });

    describe('/activate', function() {
        describe('should send a mail if new user', function() {
            it('post /subscribe', function(done) {
                superagent
                .post('http://localhost:3000/activate')
                .send({email:'469565300@qq.com'})
                .end(onResponse);

                function onResponse(err, res) {
                    res.should.have.status(200);
                    res.text.should.include('We have just drop you an email, please check your mail to avtivate your account!');
                    return done();
                }    
            });
            
        });

        // describe('should response if an email has been sent before and not be activated', function() {
        //     it('post /subscribe', function(done) {
        //         superagent
        //         .post('http://localhost:3000/activate')
        //         .send({email:'xvfeng123@gmail.com'})
        //         .end(function(err, res) {
        //             res.should.have.status(200);
        //             res.text.should.include("An email has been send before, please check your mail to activate your account. Note that you can only get another mail after 1.5h. Thanks!");
        //         });  
        //     })
        // });

        // describe('should response when the user has been activated already', function() {
        //     it('post /subscribe', function(done) {
        //         superagent
        //         .post('http://localhost:3000/activate')
        //         .send({email:'fraserxv@gmail.com'})
        //         .end(function(err, res) {
        //             res.should.have.status(200);
        //             res.text.should.include('Your account has already been activated. Just head to the login page.');
        //         });  
        //     })
        // });
    });

})