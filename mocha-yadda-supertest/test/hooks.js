'use strict';

var knex = null;

// Runs before all test cases.
// Initializes knex.
before(function() {
    console.log('mocha:before - create database connection');
    knex = require('knex')({
        client: 'postgresql',
        debug: false,
        connection: {
            host: 'localhost',
            user: '',
            password: '',
            database: 'manage-my-money',
            charset: 'utf8'
        }
    });
});

// Runs before each test case.
// Truncates tables.
beforeEach(function() {
    console.log('mocha:beforeEach - clean up database tables');
    return knex.raw('truncate table accounts, categories, transactions cascade');
});

// Runs after each test case.
// Does nothing.
afterEach(function() {
    console.log('mocha:afterEach - do nothing');
});

// Runs after all test cases.
// Destroys the database connection.
after(function() {
    console.log('mocha:after - close database connection');
    if (knex && knex.client) {
        return knex.destroy();
    }
});
