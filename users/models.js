'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  quiz1: { type: Number, default: 0 },
  quiz2: { type: Number, default: 0 },
  quiz3: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 }
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    quiz1: this.quiz1 || 0,
    quiz2: this.quiz2 || 0,
    quiz3: this.quiz3 || 0,
    totalScore: this.totalScore || 0
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };