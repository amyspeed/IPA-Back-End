'use strict';

const express = require('express');
const { Quiz } = require('./models');
const router = express.Router();

//Get all
router.get('/', (req, res) => {
    Quiz
        .find()
        .then(quizzes => res.json(quizzes))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Oops! Something went wrong' });
        });
});

//Get by Id
router.get('/:id', (req, res) => {
    Quiz
    .findById(req.params.id)
    .then(quiz => res.json(quiz))
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'somthing went wrong' });
    });
});

module.exports = { router };