'use strict';

const express = require('express');
const { Level } = require('./models');
const router = express.Router();
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

//Get all
router.get('/', jwtAuth, (req, res) => {
    Level
        .find()
        .then(levels => res.json(levels))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Oops! Something went wrong' });
        });
});

//Get by Id
router.get('/:id', jwtAuth, (req, res) => {
    Level
    .findById(req.params.id)
    .then(level => res.json(level))
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'somthing went wrong' });
    });
});

module.exports = { router };