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

    beforeEach(function() {
        return User.hashPassword(password)
            .then(password => 
                User.create({
                    username,
                    password,
                    firstName,
                    lastName
                })
        );
    });

    beforeEach(function() {
        return Level.create([
            {
                level,
                instructions,
                questions,
            },
            {
                level,
                instructions,
                questions,
            }
        ])
    });

    afterEach(function() {
        return User.deleteOne({});
    });

    afterEach(function() {
        return Level.deleteMany({})
    });

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

    describe('/api/levels/*', function() {

        const authToken = jwt.sign(
            {
                user: {
                    username,
                    firstName,
                    lastName
                }
            },
            JWT_SECRET,
            {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
            }
        );

        it('should GET all Levels', function() {
            return chai
                .request(app)
                .get('/api/levels')
                .set('Authorization', `Bearer ${authToken}`)
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    res.body.forEach(function(level) {
                        expect(level).to.be.an('object');
                        expect(level).to.contain.keys(
                            '__v',
                            '_id',
                            'level',
                            'instructions',
                            'questions'
                        );
                    })
                });
        });

        it('should GET one level by id', function() {
            return Level
                .findOne()
                .then(function(level) {
                    let id = level._id;

                    return chai 
                        .request(app) 
                        .get(`/api/levels/${id}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.contain.keys(
                                '__v',
                                '_id',
                                'level',
                                'instructions',
                                'questions'
                            );
                            expect(res.body.questions).to.be.an('array');
                            res.body.questions.forEach(function(question) {
                                expect(question).to.be.an('object');
                                expect(question).to.contain.keys(
                                    'questionNum',
                                    'question',
                                    'answer'
                                );
                            });
                        });
                });
        });
    });
});