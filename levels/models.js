'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
    questionNum: Number,
    question: String,
    answer: String
});

const LevelSchema = mongoose.Schema({
    quizName: String,
    instructions: String,
    questions: [QuestionSchema]
});

const Level = mongoose.model('Level', LevelSchema)

module.exports = { Level };