'use strict'

global.DATABASE_URL ='mongodb://localhost/ipa-app-test';
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
    const level1 = '0';
    const level2 = '0';
    const level3 = '0';
    const totalScore = '0';

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
                    lastName,
                    level1,
                    level2,
                    level3,
                    totalScore
                })
        );
    });

    beforeEach(function() {
        return Level.create({
                level,
                instructions,
                questions,
            })
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

    describe('/api/levels/* AND /api/users/scores/*', function() {

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

        it(`should GET all users' scores`, function() {
            return chai
                .request(app)
                .get('/api/users/scores')
                .set('Authorization', `Bearer ${authToken}`)
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    res.body.forEach(function(user) {
                        expect(user).to.be.an('object');
                        expect(user).to.contain.keys(
                            'username',
                            'level1',
                            'level2',
                            'totalScore'
                        );
                    });
                });
        });

        it(`should GET one user's scores by ID`, function() {
            return User
                .findOne()
                .then(function(user) {
                    let id = user._id;

                    return chai 
                        .request(app)
                        .get(`/api/users/scores/${id}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .then(function(res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.contain.keys(
                                'username',
                                'level1',
                                'level2',
                                'level3',
                                'totalScore'
                            );
                        });
            });
            
        });

        it(`Should update user's scores with PUT by ID`, function() {
            const newScores = {
                level1: 100,
                totalScore: 100
            };

            return User
                .findOne()
                .then(function(user) {
                    newScores.id = user._id;

                    return chai 
                        .request(app)
                        .put(`/api/users/scores/${user._id}`)
                        .send(newScores)
                        .set('Authorization', `Bearer ${authToken}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return User.findById(newScores.id);
                })
                .then(function(updatedUser) {
                    expect(updatedUser.level1).to.equal(newScores.level1);
                    expect(updatedUser.totalScore).to.equal(newScores.totalScore);
                });
        });
    });
});