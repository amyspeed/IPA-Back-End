'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config')
const { User } = require('../users')
const { Level } = require('../levels')

const expect = chai.expect;
chai.use(chaiHttp);

describe('Protect levels endpoint', function() {
    const username = 'testUserName';
    const password = 'testPassword';
    const firstName = 'testFirst';
    const lastName = 'testLast';

    const level = 'testLevel';
    const instructions = 'testInstructions';
    const questions = [{}];
        questions[0].questionNum = '1';
        questions[0].question = '[example1]';
        questions[0].answer= 'example1';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    // beforeEach(function() {
    //     return User.hashPassword(password)
    //         .then(password => 
    //             User.create({
    //                 username,
    //                 password,
    //                 firstName,
    //                 lastName
    //             })
    //     );
    // });

    // beforeEach(function() {
    //     return Level.create({
    //         level,
    //         instructions,
    //         questions
    //     })
    // });

    // afterEach(function() {
    //     return User.deleteOne({});
    // });

    // afterEach(function() {
    //     return Level.deleteMany({})
    // });

    after(function() {
        return closeServer();
    });

    describe('Get API', function() {
        it('should 200 on GET', function() {
            return chai
                .request(app)
                .get('/api')
                .then(function(res) {
                    expect(res).to.have.status(200);
                });
        });
    });
});