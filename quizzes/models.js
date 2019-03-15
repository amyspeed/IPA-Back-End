'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuizSchema = mongoose.Schema({
    quizName: String,
    question1: String,
    answer1: String,
    question2: String,
    answer2: String,
    question3: String,
    answer3: String,
    question4: String,
    answer4: String,
    question5: String,
    answer5: String,
    question6: String,
    answer6: String,
    question7: String,
    answer7: String,
    question8: String,
    answer8: String,
    question9: String,
    answer9: String,
    question10: String,
    answer10: String
});

const Quiz = mongoose.model('Quiz', QuizSchema)

module.exports = { Quiz };