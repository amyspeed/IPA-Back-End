'use strict';

//require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// const { router: usersRouter } = require('./users');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: quizRouter } = require('./quizzes');

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

const app = express();

app.use(express.json());

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(204);
//     }
//     next();
// });

// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use('api/users/', usersRouter);
// app.use('api/auth', authRouter);
app.use('/quizzes', quizRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('*', function (req, res) {
    res.status(404).json({ message: `Not Found` });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`App is listening on port ${port}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };