'use strict';

var request = require('supertest-as-promised');

request = request('http://localhost:8080');

module.exports = request;
