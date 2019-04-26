'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://AmySpeed:Password123@ds237717.mlab.com:37717/ipa-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-ipa-app';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://pacific-basin-65264.herokuapp.com/';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';